import { useState, useEffect, useRef } from "react";

const ADMIN_PW      = "interCareerPassword26";
const COMPANIES_KEY = "ia_companies_v2";
const SESSIONS_KEY  = "ia_sessions_v2";
const OUTLOOK_KEY   = "ia_outlook_v2";
const CONSENT_KEY   = "ia_consent_v1";

const ALL_TAGS = [
  "Software Development","Data & Analytics","Cybersecurity","IT Support",
  "Network & Infrastructure","Health IT","EdTech","Engineering & Embedded",
  "Business/Finance IT","UX/Design","Project Management","Cloud & DevOps"
];

const DEFAULT_COMPANIES = [
  {id:"1",  name:"BERPL Technologies",                type:"Technology",        tags:["Software Development","IT Support"],                               website:""},
  {id:"2",  name:"Black Boys in Tech",                type:"Nonprofit",         tags:["Software Development","Data & Analytics"],                         website:""},
  {id:"3",  name:"Cincinnati Children's Hospital",    type:"Healthcare",        tags:["Health IT","Data & Analytics","Software Development"],             website:""},
  {id:"4",  name:"Cincinnati Police Department",      type:"Government",        tags:["Cybersecurity","IT Support","Network & Infrastructure"],           website:""},
  {id:"5",  name:"EMI-RS",                            type:"Technology",        tags:["Network & Infrastructure","IT Support"],                           website:""},
  {id:"6",  name:"Encore Technologies",               type:"Technology",        tags:["IT Support","Network & Infrastructure","Cloud & DevOps"],          website:""},
  {id:"7",  name:"5/3rd Corporation",                 type:"Finance",           tags:["Business/Finance IT","Data & Analytics","Cybersecurity"],          website:""},
  {id:"8",  name:"Forward Edge",                      type:"EdTech",            tags:["EdTech","IT Support","Cloud & DevOps"],                            website:""},
  {id:"9",  name:"GE Aerospace",                      type:"Engineering",       tags:["Engineering & Embedded","Software Development","Data & Analytics"],website:""},
  {id:"10", name:"Gorilla Glue",                      type:"Manufacturing",     tags:["Software Development","IT Support"],                               website:""},
  {id:"11", name:"Great American Insurance Group",    type:"Finance",           tags:["Business/Finance IT","Data & Analytics","Cybersecurity"],          website:""},
  {id:"12", name:"Home City Ice",                     type:"Logistics",         tags:["IT Support","Business/Finance IT"],                                website:""},
  {id:"13", name:"INTERalliance",                     type:"Nonprofit",         tags:["Project Management","Software Development","EdTech"],              website:"https://interalliance.org"},
  {id:"14", name:"Junior Achievement",                type:"Nonprofit",         tags:["EdTech","Business/Finance IT"],                                    website:""},
  {id:"15", name:"KiZan",                             type:"Technology",        tags:["Cloud & DevOps","Software Development","IT Support"],              website:""},
  {id:"16", name:"The Kroger Company",                type:"Retail",            tags:["Data & Analytics","Software Development","Business/Finance IT"],   website:""},
  {id:"17", name:"NaviStone",                         type:"Technology",        tags:["Data & Analytics","Software Development"],                         website:""},
  {id:"18", name:"Paradigm",                          type:"Technology",        tags:["Software Development","Data & Analytics"],                         website:""},
  {id:"19", name:"Procter & Gamble",                  type:"Consumer Goods",    tags:["Data & Analytics","Software Development","Engineering & Embedded"],website:""},
  {id:"20", name:"REDI Cincinnati",                   type:"Econ. Development", tags:["Business/Finance IT","Project Management"],                        website:""},
  {id:"21", name:"See3D",                             type:"Nonprofit",         tags:["UX/Design","Software Development"],                                website:""},
  {id:"22", name:"SkillsGrade",                       type:"EdTech",            tags:["EdTech","Software Development"],                                   website:""},
  {id:"23", name:"Tipp City Chamber of Commerce",     type:"Business",          tags:["Business/Finance IT","IT Support"],                                website:""},
  {id:"24", name:"Univ. of Cincinnati - School of IT",type:"Education",         tags:["Software Development","Data & Analytics","Cybersecurity","Network & Infrastructure"],website:""},
  {id:"25", name:"Xavier University",                 type:"Education",         tags:["Software Development","Data & Analytics","EdTech"],                website:""},
  {id:"26", name:"Batavia Local Schools",             type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"27", name:"Clermont County Ed. Services",      type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"28", name:"Goshen Schools",                    type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"29", name:"Hamilton County Ed. Services",      type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"30", name:"Hughes STEM - PAR Studio",          type:"School",            tags:["EdTech","UX/Design","Software Development"],                       website:""},
  {id:"31", name:"Indian Hill Schools",               type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"32", name:"Kings Local Schools",               type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"33", name:"Loveland Schools",                  type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"34", name:"McNicholas High School",            type:"School",            tags:["EdTech","IT Support"],                                             website:""},
  {id:"35", name:"Oak Hills School District",         type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"36", name:"Ohio Valley CTC",                   type:"School District",   tags:["EdTech","IT Support","Network & Infrastructure"],                  website:""},
  {id:"37", name:"Seton High School",                 type:"School",            tags:["EdTech","IT Support"],                                             website:""},
  {id:"38", name:"Southwest Local Schools",           type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"39", name:"West Clermont Schools",             type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"40", name:"Williamsburg Local Schools",        type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
  {id:"41", name:"Wilmington City Schools",           type:"School District",   tags:["EdTech","IT Support"],                                             website:""},
];

const QUESTIONS = [
  "What are you interested in? Tell me about some of your hobbies too!",
  "Which sounds most like you - solving puzzles, building things, connecting with people, or analyzing information?",
  "Do you prefer working on a team, or do you like working on your own?",
  "How would you describe yourself: more competitive, collaborative, or creative?",
  "What grade are you currently in?"
];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.ia{min-height:100vh;background:#08101F;color:#DDE8F5;font-family:'Outfit',sans-serif;font-size:15px;line-height:1.55;}
.ia-grid{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(0,195,168,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,195,168,.025) 1px,transparent 1px);
  background-size:44px 44px;}
.ia-wrap{position:relative;z-index:1;}
.ia-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;
  background:rgba(8,16,31,.88);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(0,195,168,.1);position:sticky;top:0;z-index:200;}
.ia-logo{display:flex;align-items:center;gap:10px;font-family:'Syne',sans-serif;font-weight:800;font-size:17px;color:#fff;}
.ia-mark{width:34px;height:34px;background:linear-gradient(135deg,#00C3A8,#1A6FFF);border-radius:9px;
  display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;letter-spacing:-.5px;}
.ia-sub{display:block;font-family:'Outfit',sans-serif;font-size:11px;font-weight:400;color:#00C3A8;letter-spacing:.06em;margin-top:1px;}
.ia-adm-btn{background:transparent;border:1px solid rgba(0,195,168,.25);color:rgba(0,195,168,.65);
  padding:5px 14px;border-radius:7px;font-size:12px;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .18s;}
.ia-adm-btn:hover{border-color:#00C3A8;color:#00C3A8;}
.ia-priv-badge{background:rgba(255,160,0,.1);border:1px solid rgba(255,160,0,.3);color:#FFA000;
  padding:4px 12px;border-radius:20px;font-size:11.5px;font-family:'Outfit',sans-serif;}
.ia-chat{max-width:680px;margin:0 auto;height:calc(100vh - 62px);display:flex;flex-direction:column;position:relative;}
.ia-prog{height:2px;background:rgba(255,255,255,.04);flex-shrink:0;}
.ia-prog-fill{height:100%;background:linear-gradient(90deg,#00C3A8,#1A6FFF);transition:width .45s cubic-bezier(.4,0,.2,1);}
.ia-msgs{flex:1;overflow-y:auto;padding:24px 16px 90px;display:flex;flex-direction:column;gap:18px;
  scrollbar-width:thin;scrollbar-color:rgba(0,195,168,.2) transparent;}
.ia-msg{display:flex;gap:11px;animation:rise .28s ease both;}
.ia-msg.u{flex-direction:row-reverse;}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ia-av{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;font-family:'Syne',sans-serif;letter-spacing:.02em;}
.ia-av.b{background:linear-gradient(135deg,#00C3A8,#1A6FFF);color:#fff;}
.ia-av.u{background:rgba(255,100,50,.15);border:1px solid rgba(255,100,50,.3);color:#FF7A50;}
.ia-bbl{max-width:480px;padding:11px 15px;font-size:14.5px;line-height:1.55;}
.ia-msg.b .ia-bbl{background:rgba(255,255,255,.042);border:1px solid rgba(255,255,255,.07);border-radius:4px 14px 14px 14px;}
.ia-msg.u .ia-bbl{background:rgba(0,195,168,.1);border:1px solid rgba(0,195,168,.2);border-radius:14px 4px 14px 14px;}
.ia-dots{display:flex;gap:4px;align-items:center;padding:2px 0;}
.ia-dot{width:6px;height:6px;border-radius:50%;background:#00C3A8;animation:bob 1.1s infinite;}
.ia-dot:nth-child(2){animation-delay:.18s}.ia-dot:nth-child(3){animation-delay:.36s}
@keyframes bob{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.ia-sum{background:rgba(255,255,255,.032);border:1px solid rgba(0,195,168,.2);border-radius:16px;padding:18px;margin-top:8px;max-width:480px;}
.ia-sum-hd{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:#00C3A8;margin-bottom:10px;text-transform:uppercase;letter-spacing:.08em;}
.ia-sum-pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.ia-sum-pill{background:rgba(0,195,168,.1);border:1px solid rgba(0,195,168,.22);color:#7FEAD8;
  border-radius:20px;padding:4px 13px;font-size:13px;font-family:'Syne',sans-serif;font-weight:600;}
.ia-sum-co{font-size:12px;color:rgba(255,160,50,.8);margin-bottom:14px;}
.ia-outlook-cta{width:100%;background:linear-gradient(135deg,#00C3A8 0%,#1A6FFF 55%,#9B4DFF 100%);
  color:#fff;border:none;padding:12px 18px;border-radius:10px;font-family:'Syne',sans-serif;
  font-size:14px;font-weight:700;cursor:pointer;letter-spacing:.02em;transition:opacity .18s;
  display:flex;align-items:center;justify-content:center;gap:8px;}
.ia-outlook-cta:hover{opacity:.84;}
.ia-restart-sm{background:transparent;border:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.45);
  padding:7px 16px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;cursor:pointer;
  transition:all .18s;margin-top:8px;width:100%;}
.ia-restart-sm:hover{color:#fff;border-color:rgba(255,255,255,.4);}
.ia-fab{position:absolute;bottom:74px;right:12px;z-index:100;
  background:linear-gradient(135deg,#00C3A8,#1A6FFF,#9B4DFF);
  color:#fff;border:none;border-radius:24px;padding:10px 18px;
  font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:7px;letter-spacing:.02em;
  box-shadow:0 4px 20px rgba(0,195,168,.4);transition:all .22s;animation:fabpop .4s cubic-bezier(.34,1.56,.64,1) both;}
.ia-fab:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(0,195,168,.55);}
@keyframes fabpop{from{opacity:0;transform:scale(.7) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.ia-fab-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.75);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
.ia-inp-area{padding:14px 16px;border-top:1px solid rgba(255,255,255,.055);display:flex;gap:9px;align-items:center;}
.ia-inp-box{flex:1;background:rgba(255,255,255,.048);border:1px solid rgba(255,255,255,.09);
  border-radius:10px;overflow:hidden;transition:border-color .18s;}
.ia-inp-box:focus-within{border-color:rgba(0,195,168,.45);}
.ia-inp{width:100%;background:transparent;border:none;outline:none;padding:11px 14px;
  font-size:14px;color:#DDE8F5;font-family:'Outfit',sans-serif;}
.ia-inp::placeholder{color:rgba(255,255,255,.28);}
.ia-send{width:42px;height:42px;border-radius:9px;background:linear-gradient(135deg,#00C3A8,#1A6FFF);
  border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:opacity .18s;flex-shrink:0;}
.ia-send:hover{opacity:.82;}.ia-send:disabled{opacity:.35;cursor:not-allowed;}
.ia-consent-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:900;
  display:flex;align-items:center;justify-content:center;padding:16px;}
.ia-consent-card{background:#0D1827;border:1px solid rgba(0,195,168,.28);border-radius:20px;
  padding:32px 28px;width:100%;max-width:420px;}
.ia-consent-icon{font-size:26px;margin-bottom:12px;}
.ia-consent-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;}
.ia-consent-body{font-size:13.5px;color:rgba(255,255,255,.52);line-height:1.7;margin-bottom:22px;}
.ia-consent-body b{color:rgba(255,255,255,.8);font-weight:500;}
.ia-consent-save{width:100%;background:linear-gradient(135deg,#00C3A8,#1A6FFF);color:#fff;border:none;
  padding:13px 18px;border-radius:10px;font-family:'Syne',sans-serif;font-size:14.5px;font-weight:700;
  cursor:pointer;margin-bottom:9px;transition:opacity .18s;}
.ia-consent-save:hover{opacity:.84;}
.ia-consent-priv{width:100%;background:rgba(255,160,0,.07);border:1px solid rgba(255,160,0,.28);
  color:#FFA000;padding:11px 18px;border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;
  cursor:pointer;margin-bottom:9px;transition:all .18s;}
.ia-consent-priv:hover{background:rgba(255,160,0,.14);}
.ia-consent-note{font-size:11px;color:rgba(255,255,255,.22);text-align:center;line-height:1.6;}
.ia-login-wrap{display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 62px);}
.ia-login-card{background:rgba(255,255,255,.035);border:1px solid rgba(0,195,168,.18);
  border-radius:18px;padding:38px 36px;width:100%;max-width:360px;}
.ia-ltitle{font-family:'Syne',sans-serif;font-size:21px;font-weight:800;text-align:center;margin-bottom:6px;}
.ia-lsub{font-size:13px;color:rgba(255,255,255,.38);text-align:center;margin-bottom:26px;}
.ia-err{font-size:12.5px;color:#FF7A50;text-align:center;margin-top:8px;}
.ia-fg{margin-bottom:14px;}
.ia-lbl{display:block;font-size:11.5px;font-weight:600;text-transform:uppercase;
  letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:5px;}
.ia-fld{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
  border-radius:8px;padding:9px 13px;color:#DDE8F5;font-family:'Outfit',sans-serif;font-size:14px;
  outline:none;transition:border-color .18s;}
.ia-fld:focus{border-color:rgba(0,195,168,.45);}
.ia-fld::placeholder{color:rgba(255,255,255,.25);}
.ia-btn-row{display:flex;gap:9px;justify-content:flex-end;margin-top:22px;}
.ia-btn-p{background:linear-gradient(135deg,#00C3A8,#1A6FFF);color:#fff;border:none;
  padding:9px 22px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:opacity .18s;}
.ia-btn-p:hover{opacity:.82;}
.ia-btn-g{background:transparent;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.13);
  padding:9px 18px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:14px;cursor:pointer;transition:all .18s;}
.ia-btn-g:hover{color:#fff;border-color:rgba(255,255,255,.4);}
.ia-adm{max-width:920px;margin:0 auto;padding:30px 16px;}
.ia-adm-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;}
.ia-adm-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;}
.ia-tabs{display:flex;gap:3px;margin-bottom:20px;background:rgba(255,255,255,.032);
  border:1px solid rgba(255,255,255,.055);border-radius:10px;padding:4px;}
.ia-tab{flex:1;padding:7px 12px;border:none;background:transparent;color:rgba(255,255,255,.45);
  border-radius:7px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:500;transition:all .18s;}
.ia-tab.on{background:rgba(0,195,168,.12);color:#00C3A8;}
.ia-add-btn{margin-bottom:14px;display:inline-flex;align-items:center;gap:6px;
  background:linear-gradient(135deg,#00C3A8,#1A6FFF);color:#fff;border:none;
  padding:9px 18px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:600;cursor:pointer;transition:opacity .18s;}
.ia-add-btn:hover{opacity:.82;}
.ia-tbl{width:100%;border-collapse:collapse;}
.ia-tbl th{text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;
  color:rgba(255,255,255,.35);padding:7px 12px;border-bottom:1px solid rgba(255,255,255,.06);}
.ia-tbl td{padding:11px 12px;border-bottom:1px solid rgba(255,255,255,.04);font-size:13.5px;vertical-align:middle;}
.ia-tbl tr:hover td{background:rgba(255,255,255,.018);}
.ia-chip{display:inline-block;background:rgba(0,195,168,.09);border:1px solid rgba(0,195,168,.2);
  color:#00C3A8;border-radius:4px;padding:2px 8px;font-size:11px;margin:2px;}
.ia-row-btn{background:transparent;border:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.5);
  padding:4px 10px;border-radius:6px;cursor:pointer;font-size:12px;margin-right:5px;transition:all .18s;font-family:'Outfit',sans-serif;}
.ia-row-btn:hover{border-color:#00C3A8;color:#00C3A8;}
.ia-row-btn.del:hover{border-color:#FF7A50;color:#FF7A50;}
.ia-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;}
.ia-modal{background:#0F1928;border:1px solid rgba(0,195,168,.2);border-radius:16px;padding:26px;width:100%;max-width:510px;max-height:82vh;overflow-y:auto;}
.ia-modal-title{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:18px;}
.ia-tag-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.ia-ttog{padding:4px 12px;border-radius:20px;font-size:12px;cursor:pointer;
  border:1px solid rgba(255,255,255,.13);background:transparent;color:rgba(255,255,255,.45);transition:all .18s;font-family:'Outfit',sans-serif;}
.ia-ttog.on{background:rgba(0,195,168,.13);border-color:#00C3A8;color:#00C3A8;}
.ia-stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
.ia-stat-card{background:rgba(255,255,255,.038);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 16px;}
.ia-stat-n{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:#00C3A8;line-height:1;}
.ia-stat-l{font-size:11px;color:rgba(255,255,255,.38);margin-top:4px;text-transform:uppercase;letter-spacing:.06em;}
.ia-stat-v{font-size:12px;color:rgba(255,255,255,.55);margin-top:3px;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ia-sess-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.ia-clr-btn{background:transparent;border:1px solid rgba(255,100,50,.25);color:rgba(255,100,50,.55);
  padding:5px 14px;border-radius:7px;font-size:12px;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .18s;}
.ia-clr-btn:hover{border-color:#FF7A50;color:#FF7A50;}
.ia-clr-btn.confirm{background:rgba(255,100,50,.12);border-color:#FF7A50;color:#FF7A50;}
.ia-sess{background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.055);border-radius:12px;padding:15px;margin-bottom:9px;}
.ia-sess-del{background:transparent;border:none;color:rgba(255,100,50,.35);cursor:pointer;font-size:13px;padding:2px 6px;border-radius:5px;transition:color .15s;line-height:1;margin-left:auto;}
.ia-sess-del:hover{color:#FF7A50;}
.ia-smeta-row{display:flex;align-items:center;gap:6px;margin-bottom:9px;}
.ia-smeta{font-size:12px;color:rgba(255,255,255,.35);margin:0;}
.ia-stags{display:flex;flex-wrap:wrap;gap:5px;}
.ia-stag{background:rgba(0,195,168,.09);border:1px solid rgba(0,195,168,.2);color:#00C3A8;border-radius:5px;padding:2px 9px;font-size:12px;}
.ia-scot{background:rgba(255,100,50,.08);border:1px solid rgba(255,100,50,.2);color:#FF9E7A;border-radius:5px;padding:2px 9px;font-size:12px;}
.ia-sect-lbl{font-size:11px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;}
.ia-sect-lbl.co{color:rgba(255,100,50,.65);}
.ia-empty{color:rgba(255,255,255,.3);text-align:center;padding:40px 20px;font-size:14px;}
.ia-out{max-width:800px;margin:0 auto;padding:30px 16px;}
.ia-out-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;gap:14px;}
.ia-out-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;}
.ia-out-sub{font-size:13px;color:rgba(255,255,255,.38);margin-top:3px;}
.ia-out-actions{display:flex;gap:8px;flex-shrink:0;align-items:flex-start;}
.ia-out-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.ia-out-card{background:rgba(255,255,255,.032);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:18px;}
.ia-out-card-title{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.35);margin-bottom:12px;}
.ia-strength-row{display:flex;align-items:center;gap:9px;margin-bottom:8px;}
.ia-strength-label{font-size:13px;color:#DDE8F5;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ia-strength-bar{height:5px;border-radius:3px;background:rgba(0,195,168,.12);flex:2;overflow:hidden;}
.ia-strength-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#00C3A8,#1A6FFF);}
.ia-strength-ct{font-size:11px;color:rgba(0,195,168,.7);min-width:22px;text-align:right;}
.ia-co-pill-out{display:inline-block;background:rgba(255,200,80,.07);border:1px solid rgba(255,200,80,.2);
  color:#FFC850;border-radius:5px;padding:3px 10px;font-size:12px;margin:2px;}
.ia-tl-item{display:flex;gap:12px;margin-bottom:16px;align-items:flex-start;}
.ia-tl-dot{width:8px;height:8px;border-radius:50%;background:#00C3A8;margin-top:6px;flex-shrink:0;}
.ia-tl-body{flex:1;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.055);border-radius:10px;padding:12px;}
.ia-tl-date{font-size:11px;color:rgba(255,255,255,.3);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;}
.ia-tl-del{background:transparent;border:none;color:rgba(255,100,50,.3);cursor:pointer;font-size:12px;padding:0 2px;transition:color .15s;}
.ia-tl-del:hover{color:#FF7A50;}
.ia-tl-career-card{background:rgba(0,195,168,.05);border:1px solid rgba(0,195,168,.12);border-radius:8px;padding:10px 12px;margin-bottom:7px;}
.ia-tl-career-title{font-family:'Syne',sans-serif;font-size:13.5px;font-weight:700;color:#fff;margin-bottom:3px;}
.ia-tl-career-desc{font-size:12px;color:#9DB0C8;line-height:1.45;margin-bottom:4px;}
.ia-tl-career-why{font-size:11.5px;color:#00C3A8;font-style:italic;}
.ia-tl-cos-hd{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:#FF9E7A;margin:10px 0 6px;}
.ia-tl-copill{display:inline-block;background:rgba(255,100,50,.07);border:1px solid rgba(255,100,50,.18);
  color:#FF9E7A;border-radius:4px;padding:2px 8px;font-size:11.5px;margin:2px;}
.ia-insight{background:rgba(0,195,168,.04);border:1px solid rgba(0,195,168,.12);
  border-radius:12px;padding:14px 18px;font-size:13px;color:rgba(255,255,255,.55);line-height:1.7;margin-bottom:14px;}
.ia-priv-notice{background:rgba(255,160,0,.06);border:1px solid rgba(255,160,0,.2);
  border-radius:10px;padding:12px 16px;font-size:13px;color:rgba(255,160,0,.75);margin-bottom:20px;line-height:1.6;}

.ia-save-wrap{position:relative;display:inline-block;}
.ia-save-popup{position:absolute;top:calc(100% + 8px);right:0;
  background:#0D1827;border:1px solid rgba(0,195,168,.25);border-radius:12px;
  padding:8px;min-width:240px;z-index:300;animation:rise .18s ease both;}
.ia-save-opt{display:flex;align-items:center;gap:10px;width:100%;background:transparent;
  border:none;color:#DDE8F5;padding:10px 12px;border-radius:8px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:13.5px;text-align:left;transition:background .15s;}
.ia-save-opt:hover{background:rgba(255,255,255,.06);}
.ia-save-opt-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;
  justify-content:center;font-size:14px;flex-shrink:0;}
.ia-save-opt-icon.dl{background:rgba(0,195,168,.12);}
.ia-save-opt-icon.em{background:rgba(155,77,255,.12);}
.ia-save-opt-label{flex:1;}
.ia-save-opt-sub{display:block;font-size:11px;color:rgba(255,255,255,.35);margin-top:1px;}
.ia-save-divider{height:1px;background:rgba(255,255,255,.06);margin:4px 0;}
.ia-out-empty{color:rgba(255,255,255,.28);text-align:center;padding:60px 20px;font-size:14px;line-height:1.8;}
`;

function Dots({ status }) {
  return (
    <div className="ia-msg b">
      <div className="ia-av b">IA</div>
      <div className="ia-bbl">
        <div className="ia-dots"><div className="ia-dot"/><div className="ia-dot"/><div className="ia-dot"/></div>
        {status && <div style={{fontSize:12,color:"rgba(255,255,255,.35)",marginTop:6}}>{status}</div>}
      </div>
    </div>
  );
}

function ConsentModal({ onConsent }) {
  return (
    <div className="ia-consent-overlay">
      <div className="ia-consent-card">
        <div className="ia-consent-icon">🔒</div>
        <div className="ia-consent-title">Before we begin</div>
        <div className="ia-consent-body">
          INTERalliance Career Explorer can save your results to build a <b>personal Career Outlook</b> — a growing picture of your IT career interests that lives on this device and grows with each session.<br/><br/>
          Your data stays <b>on this device only</b> and is never shared with third parties. INTERalliance staff can see anonymized session statistics (career trends, grade spread) to improve the tool.<br/><br/>
          You can also choose a <b>Private Session</b> — your results are shown but absolutely nothing is saved.
        </div>
        <button className="ia-consent-save" onClick={() => onConsent("full")}>
          Save my results and build my Outlook
        </button>
        <button className="ia-consent-priv" onClick={() => onConsent("private")}>
          Private session — do not save anything
        </button>
        <div className="ia-consent-note">
          By continuing you agree to INTERalliance's use of your anonymized responses for career matching.<br/>
          You can change this choice by refreshing the page.
        </div>
      </div>
    </div>
  );
}

function LightSummary({ data, onOpenOutlook, isPrivate }) {
  return (
    <div className="ia-sum">
      <div className="ia-sum-hd">Your top IT career matches</div>
      <div className="ia-sum-pills">
        {(data.careers||[]).map((c,i) => <span className="ia-sum-pill" key={i}>{c.title}</span>)}
      </div>
      {(data.companies||[]).length > 0 && (
        <div className="ia-sum-co">
          + {data.companies.length} Cincinnati partner{data.companies.length>1?"s":""} matched to your profile
        </div>
      )}
      {!isPrivate && (
        <button className="ia-outlook-cta" onClick={onOpenOutlook}>
          <span className="ia-fab-dot"/>
          Open My Career Outlook — full breakdown inside
        </button>
      )}
      {isPrivate && (
        <div style={{fontSize:12,color:"rgba(255,160,0,.6)",marginTop:8,fontStyle:"italic"}}>
          Private session — results not saved to your Outlook.
        </div>
      )}
      <button className="ia-restart-sm" onClick={() => window.location.reload()}>Start Over</button>
    </div>
  );
}

function StudentView({ companies, onSaveSession, isPrivate, onOpenOutlook, showFab, onFabReady }) {
  const [msgs,   setMsgs]   = useState([]);
  const [input,  setInput]  = useState("");
  const [qIdx,   setQIdx]   = useState(0);
  const [answers,setAnswers]= useState([]);
  const [busy,   setBusy]   = useState(false);
  const [done,   setDone]   = useState(false);
  const [status, setStatus] = useState("");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const pushBot  = (text, extra=null) => setMsgs(m=>[...m,{role:"b",text,extra,id:uid()}]);
  const pushUser = (text)             => setMsgs(m=>[...m,{role:"u",text,id:uid()}]);

  useEffect(()=>{
    const t1=setTimeout(()=>pushBot("Hey! Welcome to INTERalliance's Career Explorer. I'll ask you 5 quick questions, then match you with IT careers and Cincinnati companies that could be a great fit."),350);
    const t2=setTimeout(()=>{pushBot(QUESTIONS[0]);setTimeout(()=>inputRef.current?.focus(),50);},1100);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);
  useEffect(()=>{if(!busy&&!done)setTimeout(()=>inputRef.current?.focus(),80);},[busy]);

  async function submit(){
    const val=input.trim();
    if(!val||busy)return;
    setInput("");
    pushUser(val);
    const newAnswers=[...answers,val];
    setAnswers(newAnswers);

    if(qIdx<QUESTIONS.length-1){
      const next=qIdx+1; setQIdx(next); setBusy(true);
      setTimeout(()=>{setBusy(false);pushBot(QUESTIONS[next]);},650);
    } else {
      setQIdx(QUESTIONS.length); setBusy(true); setDone(true); setStatus("Analyzing your answers...");
      try{
        const coList=companies.map(c=>`${c.name}|${c.tags.join(",")}`).join("\n");
        const prompt=`IT career counselor for INTERalliance Cincinnati. Student answers:
1. Interests/hobbies: ${newAnswers[0]}
2. Work style: ${newAnswers[1]}
3. Team or solo: ${newAnswers[2]}
4. Personality: ${newAnswers[3]}
5. Grade: ${newAnswers[4]}

Partner companies (name|tags):
${coList}

Return ONLY valid JSON, no fences:
{"careers":[{"title":"","description":"2 sentences","match":"1 sentence tied to student answers"},{"title":"","description":"","match":""},{"title":"","description":"","match":""}],"companies":[{"name":"exact name from list","reason":"brief reason"},{"name":"","reason":""},{"name":"","reason":""}]}`;

        setStatus("Almost there...");
        const fetchPromise = fetch("https://ia-career-proxy.dudesedrit.workers.dev/", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            messages: [
              {role:"system", content:"You are a helpful IT career counselor. Respond ONLY with valid JSON, no markdown, no explanation, no extra text."},
              {role:"user", content:prompt}
            ]
          })
        });
        const timeoutPromise = new Promise((_,reject)=>setTimeout(()=>reject(new Error("TIMEOUT")),30000));
        const res = await Promise.race([fetchPromise, timeoutPromise]);
        if(!res.ok) throw new Error("API "+res.status);
        const raw = await res.json();
        const text = raw?.choices?.[0]?.message?.content;
        if(!text) throw new Error("Empty response from API");
        const cleaned = text.replace(/```json|```/g,"").trim();
        const data = JSON.parse(cleaned);
        setStatus(""); setBusy(false);
        pushBot("Here's a quick look at your matches — open your Outlook for the full breakdown with descriptions and company details!",{type:"summary",data});
        if(!isPrivate){
          const entry={id:uid(),ts:new Date().toISOString(),answers:newAnswers,careers:data.careers,companies:data.companies};
          onSaveSession(entry);
        }
        onFabReady();
      }catch(e){
        setStatus(""); setBusy(false);
        const msg = e.message==="TIMEOUT"
          ? "Timed out after 30s. Please try again."
          : "Error: "+(e.message||"unknown")+". Please try again.";
        pushBot(msg);
        setDone(false);
      }
    }
  }

  const progress=Math.min((qIdx/QUESTIONS.length)*100,100);

  return(
    <div className="ia-chat">
      <div className="ia-prog"><div className="ia-prog-fill" style={{width:`${progress}%`}}/></div>
      <div className="ia-msgs">
        {msgs.map(m=>(
          <div key={m.id} className={`ia-msg ${m.role}`}>
            <div className={`ia-av ${m.role}`}>{m.role==="b"?"IA":"ME"}</div>
            <div>
              <div className="ia-bbl">{m.text}</div>
              {m.extra?.type==="summary"&&<LightSummary data={m.extra.data} onOpenOutlook={onOpenOutlook} isPrivate={isPrivate}/>}
            </div>
          </div>
        ))}
        {busy&&<Dots status={status}/>}
        <div ref={bottomRef}/>
      </div>
      {showFab&&!isPrivate&&(
        <button className="ia-fab" onClick={onOpenOutlook}>
          <span className="ia-fab-dot"/>My Career Outlook
        </button>
      )}
      {!done&&(
        <div className="ia-inp-area">
          <div className="ia-inp-box">
            <input ref={inputRef} className="ia-inp" value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")submit();}}
              placeholder="Type your answer..." disabled={busy}/>
          </div>
          <button className="ia-send" onClick={submit} disabled={!input.trim()||busy}>&#x27A4;</button>
        </div>
      )}
    </div>
  );
}

function OutlookView({ outlook, onDeleteEntry, onBack, isPrivate }) {
  const [showSave, setShowSave] = useState(false);
  const saveRef = useRef(null);
  useEffect(()=>{
    function handler(e){if(saveRef.current&&!saveRef.current.contains(e.target))setShowSave(false);}
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[]);
  const careerCounts={}, companySeen={};
  outlook.forEach(s=>{
    (s.careers||[]).forEach(c=>{const t=c.title||c; careerCounts[t]=(careerCounts[t]||0)+1;});
    (s.companies||[]).forEach(c=>{const n=c.name||c; if(!companySeen[n]) companySeen[n]=c.reason||"";});
  });
  const sortedCareers=Object.entries(careerCounts).sort((a,b)=>b[1]-a[1]);
  const maxCount=sortedCareers[0]?.[1]||1;

  function doExport(){
    const lines=[];
    lines.push("INTERalliance - My Career Outlook");
    lines.push("Generated: "+new Date().toLocaleString());
    lines.push("=".repeat(42)); lines.push("");
    if(sortedCareers.length){
      lines.push("CAREER STRENGTH MAP"); lines.push("-".repeat(20));
      sortedCareers.forEach(([t,n])=>lines.push(`${t} (matched ${n}x)`));
      lines.push("");
    }
    if(Object.keys(companySeen).length){
      lines.push("COMPANIES IN MY NETWORK"); lines.push("-".repeat(24));
      Object.entries(companySeen).forEach(([n,r])=>lines.push(`- ${n}${r?" - "+r:""}`));
      lines.push("");
    }
    outlook.forEach((s,i)=>{
      lines.push(`SESSION ${i+1} - ${new Date(s.ts).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}`);
      lines.push("-".repeat(30));
      (s.careers||[]).forEach((c,j)=>{
        const title=c.title||c; const desc=c.description||""; const match=c.match||"";
        lines.push(`${j+1}. ${title}`);
        if(desc) lines.push(`   ${desc}`);
        if(match) lines.push(`   Why it fits: ${match}`);
        lines.push("");
      });
      if((s.companies||[]).length){
        lines.push("Companies matched:");
        s.companies.forEach(c=>{const n=c.name||c; const r=c.reason||""; lines.push(`  - ${n}${r?" - "+r:""}`);});
      }
      lines.push("");
    });
    lines.push("Learn more at interalliance.org");
    const blob=new Blob([lines.join("\n")],{type:"text/plain"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="my-career-outlook.txt"; a.click();
  }

  return(
    <div className="ia-out">
      <div className="ia-out-top">
        <div>
          <div className="ia-out-title">My Career Outlook</div>
          <div className="ia-out-sub">
            {isPrivate?"Private session - this data is not saved":`${outlook.length} session${outlook.length!==1?"s":""} - stored on this device only`}
          </div>
        </div>
        <div className="ia-out-actions">
          {outlook.length>0&&!isPrivate&&(
            <div className="ia-save-wrap" ref={saveRef}>
              <button className="ia-btn-p" style={{fontSize:13,padding:"8px 16px"}} onClick={()=>setShowSave(s=>!s)}>
                Save {showSave ? "▲" : "▼"}
              </button>
              {showSave&&(
                <div className="ia-save-popup">
                  <button className="ia-save-opt" onClick={()=>{doExport();setShowSave(false);}}>
                    <div className="ia-save-opt-icon dl">&#x2B07;</div>
                    <div className="ia-save-opt-label">
                      Download file
                      <span className="ia-save-opt-sub">Saves a .txt to your device</span>
                    </div>
                  </button>
                  <div className="ia-save-divider"/>
                  <button className="ia-save-opt" style={{opacity:.6,cursor:"not-allowed"}} disabled>
                    <div className="ia-save-opt-icon em">&#x2709;</div>
                    <div className="ia-save-opt-label">
                      Email my results
                      <span className="ia-save-opt-sub">Coming soon</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="ia-btn-g" onClick={onBack}>Back to chat</button>
        </div>
      </div>

      {isPrivate&&(
        <div className="ia-priv-notice">
          You chose private mode - nothing from this session is being saved. Refresh the page and select "Save my results" to start building your Outlook over time.
        </div>
      )}

      {outlook.length===0?(
        <div className="ia-out-empty">No sessions saved yet.<br/>Complete a chat to start building your Outlook!</div>
      ):(
        <>
          {sortedCareers.length>0&&(
            <div className="ia-out-grid">
              <div className="ia-out-card">
                <div className="ia-out-card-title">Career strength map</div>
                {sortedCareers.map(([career,count])=>(
                  <div className="ia-strength-row" key={career}>
                    <div className="ia-strength-label" title={career}>{career}</div>
                    <div className="ia-strength-bar"><div className="ia-strength-fill" style={{width:`${Math.round((count/maxCount)*100)}%`}}/></div>
                    <div className="ia-strength-ct">x{count}</div>
                  </div>
                ))}
              </div>
              <div className="ia-out-card">
                <div className="ia-out-card-title">Companies in your network</div>
                {Object.keys(companySeen).length===0
                  ?<div style={{color:"rgba(255,255,255,.3)",fontSize:13}}>None yet</div>
                  :Object.keys(companySeen).map(c=><span className="ia-co-pill-out" key={c} title={companySeen[c]}>{c}</span>)
                }
              </div>
            </div>
          )}

          {sortedCareers[0]&&(
            <div className="ia-insight">
              <span style={{color:"#00C3A8",fontWeight:500}}>{sortedCareers[0][0]}</span> is your strongest career signal
              {sortedCareers[0][1]>1?' - it has come up '+sortedCareers[0][1]+' times.':'.'}
              {Object.keys(companySeen).length>0&&(<> You have been connected with <span style={{color:"#FFC850",fontWeight:500}}>{Object.keys(companySeen).length} Cincinnati partner{Object.keys(companySeen).length>1?"s":""}</span> so far.</>)}
            </div>
          )}

          <div style={{marginBottom:8,fontSize:11,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em"}}>Session history</div>
          {outlook.map((s,i)=>(
            <div className="ia-tl-item" key={i}>
              <div className="ia-tl-dot"/>
              <div className="ia-tl-body">
                <div className="ia-tl-date">
                  <span>{new Date(s.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                  {!isPrivate&&<button className="ia-tl-del" title="Remove this session" onClick={()=>onDeleteEntry(i)}>Remove</button>}
                </div>
                {(s.careers||[]).map((c,j)=>(
                  <div className="ia-tl-career-card" key={j}>
                    <div className="ia-tl-career-title">{j+1}. {c.title||c}</div>
                    {c.description&&<div className="ia-tl-career-desc">{c.description}</div>}
                    {c.match&&<div className="ia-tl-career-why">{c.match}</div>}
                  </div>
                ))}
                {(s.companies||[]).length>0&&(
                  <>
                    <div className="ia-tl-cos-hd">Companies matched</div>
                    {s.companies.map((c,j)=><span className="ia-tl-copill" key={j} title={c.reason||""}>{c.name||c}</span>)}
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function AdminLogin({ onSuccess, onBack }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  function attempt(){if(pw===ADMIN_PW){onSuccess();}else{setErr("Incorrect password.");setPw("");}}
  return(
    <div className="ia-login-wrap">
      <div className="ia-login-card">
        <div className="ia-ltitle">Admin Panel</div>
        <div className="ia-lsub">INTERalliance Career Explorer</div>
        <div className="ia-fg">
          <label className="ia-lbl">Password</label>
          <input className="ia-fld" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Enter admin password"/>
          {err&&<div className="ia-err">{err}</div>}
        </div>
        <div className="ia-btn-row">
          <button className="ia-btn-g" onClick={onBack}>Back</button>
          <button className="ia-btn-p" onClick={attempt}>Login</button>
        </div>
      </div>
    </div>
  );
}

function CompanyModal({ company, onSave, onClose }) {
  const [form,setForm]=useState({...company});
  function toggleTag(tag){setForm(f=>({...f,tags:f.tags.includes(tag)?f.tags.filter(t=>t!==tag):[...f.tags,tag]}));}
  return(
    <div className="ia-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="ia-modal">
        <div className="ia-modal-title">{company.id?"Edit Company":"Add Company"}</div>
        <div className="ia-fg"><label className="ia-lbl">Company Name</label><input className="ia-fld" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. The Kroger Company"/></div>
        <div className="ia-fg"><label className="ia-lbl">Type</label><input className="ia-fld" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="e.g. Healthcare, Technology, School District"/></div>
        <div className="ia-fg"><label className="ia-lbl">Website (optional)</label><input className="ia-fld" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://"/></div>
        <div className="ia-fg">
          <label className="ia-lbl">IT Focus Tags</label>
          <div className="ia-tag-grid">
            {ALL_TAGS.map(tag=><button key={tag} className={`ia-ttog ${form.tags.includes(tag)?"on":""}`} onClick={()=>toggleTag(tag)}>{tag}</button>)}
          </div>
        </div>
        <div className="ia-btn-row">
          <button className="ia-btn-g" onClick={onClose}>Cancel</button>
          <button className="ia-btn-p" onClick={()=>form.name.trim()&&onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

function AdminView({ companies, sessions, onSaveCompanies, onDeleteSession, onClearSessions, onBack }) {
  const [tab,setTab]=useState("companies");
  const [modal,setModal]=useState(null);
  const [clearConfirm,setClearConfirm]=useState(false);

  function openAdd(){setModal({name:"",type:"",tags:[],website:""});}
  function openEdit(c){setModal({...c});}
  function handleSave(form){
    if(form.id){onSaveCompanies(companies.map(c=>c.id===form.id?form:c));}
    else{onSaveCompanies([...companies,{...form,id:uid()}]);}
    setModal(null);
  }
  function handleDelete(id){if(window.confirm("Delete this company?"))onSaveCompanies(companies.filter(c=>c.id!==id));}

  return(
    <div className="ia-adm">
      <div className="ia-adm-top">
        <div className="ia-adm-title">Admin Panel</div>
        <button className="ia-btn-g" onClick={onBack}>Back to Chatbot</button>
      </div>
      <div className="ia-tabs">
        <button className={`ia-tab ${tab==="companies"?"on":""}`} onClick={()=>setTab("companies")}>Companies ({companies.length})</button>
        <button className={`ia-tab ${tab==="sessions"?"on":""}`} onClick={()=>setTab("sessions")}>Session Log ({sessions.length})</button>
      </div>

      {tab==="companies"&&(
        <div>
          <button className="ia-add-btn" onClick={openAdd}>+ Add Company</button>
          <div style={{overflowX:"auto"}}>
            <table className="ia-tbl">
              <thead><tr><th>Company</th><th>Type</th><th>IT Focus Tags</th><th>Actions</th></tr></thead>
              <tbody>
                {companies.map(c=>(
                  <tr key={c.id}>
                    <td style={{fontWeight:500}}>{c.website?<a href={c.website} style={{color:"#00C3A8",textDecoration:"none"}} target="_blank" rel="noopener noreferrer">{c.name}</a>:c.name}</td>
                    <td style={{color:"rgba(255,255,255,.4)",fontSize:12}}>{c.type}</td>
                    <td>{c.tags.map(t=><span className="ia-chip" key={t}>{t}</span>)}</td>
                    <td>
                      <button className="ia-row-btn" onClick={()=>openEdit(c)}>Edit</button>
                      <button className="ia-row-btn del" onClick={()=>handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="sessions"&&(
        <div>
          {sessions.length>0&&(()=>{
            const cc={},co={},gc={};
            sessions.forEach(s=>{
              (s.careers||[]).forEach(c=>{const t=c.title||c;cc[t]=(cc[t]||0)+1;});
              (s.companies||[]).forEach(c=>{const n=c.name||c;co[n]=(co[n]||0)+1;});
              const g=s.answers?.[4]??"?"; gc[g]=(gc[g]||0)+1;
            });
            const tc=Object.entries(cc).sort((a,b)=>b[1]-a[1])[0];
            const tco=Object.entries(co).sort((a,b)=>b[1]-a[1])[0];
            const gs=Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([g,n])=>`${g} (${n})`).join(", ");
            return(
              <div className="ia-stats-bar">
                <div className="ia-stat-card"><div className="ia-stat-n">{sessions.length}</div><div className="ia-stat-l">Students helped</div></div>
                <div className="ia-stat-card"><div className="ia-stat-n">{tc?tc[1]:0}</div><div className="ia-stat-l">Top career</div><div className="ia-stat-v">{tc?tc[0]:"none yet"}</div></div>
                <div className="ia-stat-card"><div className="ia-stat-n">{tco?tco[1]:0}</div><div className="ia-stat-l">Top company</div><div className="ia-stat-v">{tco?tco[0]:"none yet"}</div></div>
                <div className="ia-stat-card"><div className="ia-stat-n">{Object.keys(gc).length}</div><div className="ia-stat-l">Grade spread</div><div className="ia-stat-v">{gs||"none yet"}</div></div>
              </div>
            );
          })()}
          <div className="ia-sess-hd">
            <span style={{fontSize:13,color:"rgba(255,255,255,.35)"}}>{sessions.length} session{sessions.length!==1?"s":""}</span>
            {sessions.length>0&&(
              <button className={`ia-clr-btn${clearConfirm?" confirm":""}`}
                onClick={()=>{if(!clearConfirm){setClearConfirm(true);setTimeout(()=>setClearConfirm(false),3500);}else{onClearSessions();setClearConfirm(false);}}}>
                {clearConfirm?"Tap again to confirm":"Clear All Sessions"}
              </button>
            )}
          </div>
          {sessions.length===0
            ?<div className="ia-empty">No sessions yet. Student results will appear here after each completed chat.</div>
            :sessions.map(s=>(
              <div className="ia-sess" key={s.id}>
                <div className="ia-smeta-row">
                  <span className="ia-smeta">{new Date(s.ts).toLocaleString()} - Grade: {s.answers?.[4]??"unknown"}</span>
                  <button className="ia-sess-del" onClick={()=>onDeleteSession(s.id)}>x</button>
                </div>
                <div style={{marginBottom:10}}>
                  <div className="ia-sect-lbl">Careers matched</div>
                  <div className="ia-stags">{(s.careers||[]).map((c,i)=><span className="ia-stag" key={i}>{c.title||c}</span>)}</div>
                </div>
                {(s.companies||[]).length>0&&(
                  <div>
                    <div className="ia-sect-lbl co">Companies shown</div>
                    <div className="ia-stags">{s.companies.map((c,i)=><span className="ia-scot" key={i}>{c.name||c}</span>)}</div>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}
      {modal&&<CompanyModal company={modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </div>
  );
}

export default function App() {
  const [screen,   setScreen]   = useState("student");
  const [companies,setCompanies]= useState(null);
  const [sessions, setSessions] = useState([]);
  const [outlook,  setOutlook]  = useState([]);
  const [consent,  setConsent]  = useState(null);
  const [showFab,  setShowFab]  = useState(false);
  const [loaded,   setLoaded]   = useState(false);

  useEffect(()=>{
    try{const r=localStorage.getItem(COMPANIES_KEY);setCompanies(r?JSON.parse(r):DEFAULT_COMPANIES);if(!r)localStorage.setItem(COMPANIES_KEY,JSON.stringify(DEFAULT_COMPANIES));}catch(e){setCompanies(DEFAULT_COMPANIES);}
    try{const r=localStorage.getItem(SESSIONS_KEY);if(r)setSessions(JSON.parse(r));}catch(e){}
    try{const r=localStorage.getItem(OUTLOOK_KEY);if(r)setOutlook(JSON.parse(r));}catch(e){}
    try{const r=localStorage.getItem(CONSENT_KEY);if(r&&JSON.parse(r)==="full")setConsent("full");}catch(e){}
    setLoaded(true);
  },[]);

  function handleConsent(choice){
    setConsent(choice);
    if(choice==="full"){try{localStorage.setItem(CONSENT_KEY,JSON.stringify("full"));}catch(e){}}
  }
  function saveCompanies(list){setCompanies(list);try{localStorage.setItem(COMPANIES_KEY,JSON.stringify(list));}catch(e){}}
  function saveSession(s){
    setSessions(prev=>{const u=[s,...prev].slice(0,500);try{localStorage.setItem(SESSIONS_KEY,JSON.stringify(u));}catch(e){}return u;});
    setOutlook(prev=>{const entry={ts:s.ts,careers:s.careers,companies:s.companies};const u=[entry,...prev].slice(0,200);try{localStorage.setItem(OUTLOOK_KEY,JSON.stringify(u));}catch(e){}return u;});
  }
  function deleteSession(id){setSessions(prev=>{const u=prev.filter(s=>s.id!==id);try{localStorage.setItem(SESSIONS_KEY,JSON.stringify(u));}catch(e){}return u;});}
  function clearSessions(){setSessions([]);try{localStorage.setItem(SESSIONS_KEY,JSON.stringify([]));}catch(e){}}
  function deleteOutlookEntry(idx){setOutlook(prev=>{const u=[...prev];u.splice(idx,1);try{localStorage.setItem(OUTLOOK_KEY,JSON.stringify(u));}catch(e){}return u;});}

  if(!loaded) return(
    <div className="ia"><style>{CSS}</style><div className="ia-grid"/>
      <div className="ia-wrap" style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"rgba(255,255,255,.3)"}}>Loading...</div>
    </div>
  );

  const isPrivate=consent==="private";

  return(
    <div className="ia">
      <style>{CSS}</style>
      <div className="ia-grid"/>
      <div className="ia-wrap">
        <header className="ia-hdr">
          <div className="ia-logo">
            <div className="ia-mark">IA</div>
            <div>INTERalliance<span className="ia-sub">Career Explorer</span></div>
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            {isPrivate&&<span className="ia-priv-badge">Private Session</span>}
            {screen==="student"&&<button className="ia-adm-btn" onClick={()=>setScreen("admin-login")}>Admin</button>}
            {(screen==="outlook"||screen==="admin"||screen==="admin-login")&&(
              <button className="ia-adm-btn" onClick={()=>setScreen("student")}>Back to Chat</button>
            )}
          </div>
        </header>

        {consent===null&&<ConsentModal onConsent={handleConsent}/>}

        {screen==="student"&&<StudentView companies={companies} onSaveSession={saveSession} isPrivate={isPrivate} onOpenOutlook={()=>setScreen("outlook")} showFab={showFab} onFabReady={()=>setShowFab(true)}/>}
        {screen==="admin-login"&&<AdminLogin onSuccess={()=>setScreen("admin")} onBack={()=>setScreen("student")}/>}
        {screen==="admin"&&<AdminView companies={companies} sessions={sessions} onSaveCompanies={saveCompanies} onDeleteSession={deleteSession} onClearSessions={clearSessions} onBack={()=>setScreen("student")}/>}
        {screen==="outlook"&&<OutlookView outlook={outlook} onDeleteEntry={deleteOutlookEntry} onBack={()=>setScreen("student")} isPrivate={isPrivate}/>}
      </div>
    </div>
  );
}
