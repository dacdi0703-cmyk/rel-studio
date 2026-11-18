import express from 'express';
import {WebSocketServer} from 'ws';
import {createServer} from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dbfile=process.env.DATA_FILE||path.join(root,'rel-data.json');
let db={users:[],games:[],codes:[],rooms:[]};
try{db={...db,...JSON.parse(fs.readFileSync(dbfile,'utf8'))}}catch{}
const persist=()=>{fs.mkdirSync(path.dirname(dbfile),{recursive:true});fs.writeFileSync(dbfile,JSON.stringify(db))};
const hash=(p,s)=>crypto.scryptSync(p,s,64).toString('hex');
const tokens=new Map();
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'3mb'}));
app.use(express.static(path.join(root,'../public')));
function auth(req,res,next){const token=(req.headers.authorization||'').replace(/^Bearer /,'');const id=tokens.get(token);req.user=db.users.find(x=>x.id===id);if(!req.user)return res.status(401).json({error:'Đăng nhập trước'});next()}
const safeUser=u=>({id:u.id,username:u.username,email:u.email,admin:!!u.admin,premiumUntil:u.premiumUntil||0});
const error=(res,e,code=400)=>res.status(code).json({error:e});
app.post('/api/register',(req,res)=>{const {username,password,email=''}=req.body||{};if(!/^[\w]{3,24}$/.test(username||''))return error(res,'Tên 3-24 ký tự chữ/số/_');if(typeof password!=='string'||password.length<8)return error(res,'Mật khẩu tối thiểu 8 ký tự');if(db.users.some(u=>u.username.toLowerCase()===username.toLowerCase()))return error(res,'Tên đã tồn tại');const salt=crypto.randomBytes(16).toString('hex');const u={id:crypto.randomUUID(),username,email,salt,passwordHash:hash(password,salt),admin:false,premiumUntil:0};db.users.push(u);persist();const token=crypto.randomBytes(32).toString('hex');tokens.set(token,u.id);res.json({token,user:safeUser(u)})});
app.post('/api/login',(req,res)=>{const {username,password}=req.body||{};const u=db.users.find(u=>u.username.toLowerCase()===(username||'').toLowerCase());if(!u||typeof password!=='string'||hash(password,u.salt)!==u.passwordHash)return error(res,'Sai tài khoản hoặc mật khẩu',401);const token=crypto.randomBytes(32).toString('hex');tokens.set(token,u.id);res.json({token,user:safeUser(u)})});
app.get('/api/me',auth,(req,res)=>res.json(safeUser(req.user)));
app.get('/api/games',(req,res)=>res.json(db.games.filter(g=>g.published).map(({world,...g})=>g)));
app.get('/api/games/mine',auth,(req,res)=>res.json(db.games.filter(g=>g.owner===req.user.id)));
app.get('/api/games/:id',(req,res)=>{const g=db.games.find(g=>g.id===req.params.id);if(!g||!g.published)return error(res,'Không có game công khai',404);res.json(g)});
app.post('/api/games',auth,(req,res)=>{const {id,title,world,published=true}=req.body||{};if(typeof title!=='string'||title.length>90||!world||typeof world!=='object')return error(res,'Dữ liệu không hợp lệ');let g=id?db.games.find(x=>x.id===id):null;if(g&&g.owner!==req.user.id)return error(res,'Không có quyền',403);const cap=req.user.premiumUntil>Date.now()?10:1;if(!g&&db.games.filter(x=>x.owner===req.user.id&&x.published).length>=cap&&published)return error(res,'Đã đạt giới hạn game công khai');if(!g){g={id:crypto.randomUUID(),owner:req.user.id,author:req.user.username};db.games.push(g)}Object.assign(g,{title:title.slice(0,90),world,published:!!published,updatedAt:Date.now()});persist();res.json({id:g.id,url:'/play/'+g.id})});
app.post('/api/games/:id/toggle',auth,(req,res)=>{const g=db.games.find(x=>x.id===req.params.id&&x.owner===req.user.id);if(!g)return error(res,'Không có quyền',403);g.published=!!req.body.published;persist();res.json({published:g.published})});
app.get('/play/:id',(req,res)=>res.sendFile(path.join(root,'../public/index.html')));
app.get('/api/rooms',(req,res)=>res.json(db.rooms));
app.post('/api/rooms',auth,(req,res)=>{const mine=db.rooms.filter(r=>r.owner===req.user.id);if(mine.length>=2)return error(res,'Tối đa 2 phòng');const room={id:crypto.randomUUID(),name:String(req.body.name||'Phòng mới').slice(0,50),owner:req.user.id,gameId:req.body.gameId||null};db.rooms.push(room);persist();res.json(room)});
app.post('/api/redeem',auth,(req,res)=>{const c=db.codes.find(x=>x.code===String(req.body.code||'').trim().toUpperCase());if(!c||c.usedBy||c.expiresAt&&c.expiresAt<Date.now())return error(res,'Mã không hợp lệ hoặc đã sử dụng');c.usedBy=req.user.id;req.user.premiumUntil=Math.max(Date.now(),req.user.premiumUntil||0)+c.days*86400000;persist();res.json(safeUser(req.user))});
function admin(req,res,next){if(!req.user.admin)return error(res,'Chỉ quản trị viên',403);next()}
app.post('/api/admin/codes',auth,admin,(req,res)=>{const days=Number(req.body.days);if(!Number.isInteger(days)||days<1||days>365)return error(res,'Số ngày không hợp lệ');const code='PRE'+days+'-'+crypto.randomBytes(4).toString('hex').toUpperCase();db.codes.push({code,days,createdAt:Date.now(),usedBy:null});persist();res.json({code,days})});
app.post('/api/admin/grant',auth,admin,(req,res)=>{const u=db.users.find(x=>x.username.toLowerCase()===String(req.body.username||'').toLowerCase());const days=Number(req.body.days);if(!u||!Number.isInteger(days)||days<1||days>365)return error(res,'Sai người dùng hoặc số ngày');u.premiumUntil=Math.max(Date.now(),u.premiumUntil||0)+days*86400000;persist();res.json(safeUser(u))});
app.post('/api/admin/bootstrap',(req,res)=>{const secret=process.env.REL_ADMIN_SETUP_KEY;if(!secret||req.body.setupKey!==secret)return error(res,'Không được phép',403);const u=db.users.find(x=>x.username===req.body.username);if(!u)return error(res,'Hãy đăng ký tài khoản trước');u.admin=true;u.premiumUntil=Date.now()+3650*86400000;persist();res.json({ok:true})});
const server=createServer(app);const wss=new WebSocketServer({server,path:'/ws'});const sockets=new Map();
wss.on('connection',ws=>{let room=null,username='Khách';ws.on('message',raw=>{if(raw.length>4096)return;let m;try{m=JSON.parse(raw)}catch{return}if(m.type==='join'){const r=db.rooms.find(x=>x.id===m.room);if(!r)return;room=r.id;username=String(m.username||'Khách').slice(0,24);sockets.set(ws,{room,username});ws.send(JSON.stringify({type:'joined',room}))}else if(m.type==='chat'&&room){const out=JSON.stringify({type:'chat',username,text:String(m.text||'').slice(0,300)});for(const [peer,info] of sockets)if(info.room===room&&peer.readyState===1)peer.send(out)}else if(m.type==='state'&&room){const out=JSON.stringify({type:'state',username,x:Number(m.x)||0,y:Number(m.y)||0});for(const [peer,info] of sockets)if(peer!==ws&&info.room===room&&peer.readyState===1)peer.send(out)}});ws.on('close',()=>sockets.delete(ws))});
server.listen(process.env.PORT||3000,()=>console.log('R\'EL server ready'));
