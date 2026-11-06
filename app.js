const $=id=>document.getElementById(id);
const today=()=>{let d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const plus=(s,n)=>{let d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const fmt=s=>new Date(s+"T12:00:00").toLocaleDateString("id-ID",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
const monthFmt=s=>new Date(s+"T12:00:00").toLocaleDateString("id-ID",{month:"long",year:"numeric"});
const defaults={staff:["Fazrianur","Biaggi V.","Joko S.","Andry I.","Wendra V.","M. Sidik"],schedule:{},ot:[],holidays:[],settings:{shift1:"06:00 - 14:00",shift2:"14:00 - 22:00",shift3:"22:00 - 06:00",dls:"06:00 - 18:00",nls:"18:00 - 06:00",breakHours:1,reminderTime:"06:00"}};
let data=load(), monthCursor=new Date(); monthCursor.setDate(1);
function load(){try{return {...defaults,...JSON.parse(localStorage.getItem("mws-data")||"{}")}}catch(e){return structuredClone(defaults)}}
function save(){localStorage.setItem("mws-data",JSON.stringify(data));render()}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function shiftLabel(x){return ({S:"SIANG",SR:"SORE",P:"PAGI",M:"MALAM",OFF:"OFF",OT:"OT",NLS:"LONGSHIFT MALAM",DLS:"LONGSHIFT SIANG"})[x]||x}
function getEntry(date,name){return data.schedule[date]?.[name]||"OFF"}
function render(){
 $("todayLabel").textContent=fmt(today());
 const todays=data.schedule[today()]||{};let entries=data.staff.map(n=>[n,todays[n]||"OFF"]);
 $("workCount").textContent=entries.filter(x=>x[1]!=="OFF").length;
 $("offCount").textContent=entries.filter(x=>x[1]==="OFF").length;
 $("otCount").textContent=data.ot.filter(x=>x.date===today()).length;
 $("todayRoster").innerHTML=entries.map(([n,s])=>`<div class="person"><span>${safe(n)}</span><span class="pill ${s}">${shiftLabel(s)}</span></div>`).join("");
 renderSchedule();renderDashboardRoster();renderStaff();renderOT();renderHolidays();renderReports();
}
function generate(start,days){
 // Assign two consecutive OFF days per employee, staggered; remaining workers cover 3 shifts plus backup.
 for(let i=0;i<days;i++){let date=plus(start,i),dow=Math.floor((new Date(date+"T12:00:00")-new Date(start+"T12:00:00"))/86400000);
  let offSet=new Set();
  data.staff.forEach((n,idx)=>{let offStart=(idx*2)%7;if(dow%7===offStart||dow%7===(offStart+1)%7)offSet.add(n)});
  let working=data.staff.filter(n=>!offSet.has(n));
  // Keep at least 3 on duty; with six staff and staggered off pairs this gives 4-5 on most days.
  let shifts=["P","S","M"],assigned={};
  shifts.forEach((s,j)=>{let n=working[(i+j)%working.length];if(n)assigned[n]=s});
  working.forEach((n,j)=>{if(!assigned[n])assigned[n]=["P","S","M"][(j+i)%3]});
  data.schedule[date]=Object.fromEntries(data.staff.map(n=>[n,assigned[n]||"OFF"]));
 }
 save();
}
function rosterMarkup(filterName="ALL"){
 let year=monthCursor.getFullYear(),month=monthCursor.getMonth(),first=new Date(year,month,1),last=new Date(year,month+1,0),days=last.getDate();
 let dates=Array.from({length:days},(_,i)=>year+"-"+String(month+1).padStart(2,"0")+"-"+String(i+1).padStart(2,"0"));
 let codeOpts=[["P","P"],["S","S"],["M","M"],["OFF","OFF"],["NLS","NLS"],["DLS","DLS"]];
 let names=filterName==="ALL"?data.staff:data.staff.filter(n=>n===filterName);
 let head=`<div class="roster-scroll"><table class="roster"><thead><tr><th class="namecol">NAMA</th>${dates.map(d=>`<th class="datehead">${new Date(d+"T12:00:00").toLocaleDateString("id-ID",{weekday:"short"})}<br>${d.slice(8,10)}</th>`).join("")}</tr></thead><tbody>`;
 let rows=names.map(n=>`<tr><td class="namecol">${safe(n)}</td>${dates.map(d=>{let v=getEntry(d,n);if(!codeOpts.some(x=>x[0]===v))v="OFF";return `<td><select class="shiftSel ${v}" data-date="${d}" data-name="${safe(n)}">${codeOpts.map(([k,l])=>`<option value="${k}" ${v===k?"selected":""}>${l}</option>`).join("")}</select></td>`}).join("")}</tr>`).join("");
 let offnotes=dates.map(d=>{let off=data.staff.filter(n=>getEntry(d,n)==="OFF"&&(filterName==="ALL"||n===filterName));return `<td>${off.length?off.map(n=>safe(n)).join(", "):"-"}</td>`}).join("");
 let holidays=dates.map(d=>{let h=data.holidays.filter(x=>x.date===d);return `<td>${h.length?h.map(x=>safe(x.name)).join(", "):""}</td>`}).join("");
 let leaves=dates.map(d=>`<td>-</td>`).join("");
 return head+rows+`<tr class="note-row"><td class="namecol">CATATAN OFF</td>${offnotes}</tr><tr class="note-row"><td class="namecol">LIBUR NASIONAL</td>${holidays}</tr><tr class="note-row"><td class="namecol">CATATAN CUTI</td>${leaves}</tr></tbody></table></div>`;
}
function bindRosterEdits(root){root.querySelectorAll(".roster select").forEach(el=>el.addEventListener("change",()=>{data.schedule[el.dataset.date]??={};data.schedule[el.dataset.date][el.dataset.name]=el.value;localStorage.setItem("mws-data",JSON.stringify(data));render()}));}
function renderSchedule(){
 let label=monthFmt(monthCursor.getFullYear()+"-"+String(monthCursor.getMonth()+1).padStart(2,"0")+"-01");
 $("monthLabel").textContent=label;
 $("scheduleList").innerHTML=rosterMarkup("ALL");bindRosterEdits($("scheduleList"));
}
function renderDashboardRoster(){
 let label=monthFmt(monthCursor.getFullYear()+"-"+String(monthCursor.getMonth()+1).padStart(2,"0")+"-01");
 $("homeMonthLabel").textContent=label;
 let sel=$("dashboardNameFilter"),current=sel.value||"ALL";
 sel.innerHTML='<option value="ALL">Semua karyawan</option>'+data.staff.map(n=>`<option value="${safe(n)}">${safe(n)}</option>`).join("");
 sel.value=data.staff.includes(current)?current:"ALL";
 $("dashboardSchedule").innerHTML=rosterMarkup(sel.value);bindRosterEdits($("dashboardSchedule"));
}
function renderStaff(){
 $("staffList").innerHTML=data.staff.map((n,i)=>`<div class="person"><span>${safe(n)}</span><button class="danger" data-remove="${i}">Hapus</button></div>`).join("");
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{if(data.staff.length<=3)return alert("Minimal 3 karyawan untuk menutup 3 shift.");data.staff.splice(+b.dataset.remove,1);save()});
 $("otStaff").innerHTML=data.staff.map(n=>`<option>${safe(n)}</option>`).join("");
}
function renderOT(){$("otList").innerHTML=data.ot.slice(-8).reverse().map(o=>`${safe(o.date)} • ${safe(o.name)} • ${safe(o.start)}-${safe(o.end)} • OT dibayar ${Number(o.net??o.gross??0).toFixed(1)} jam (istirahat dibayar) <button data-delot="${o.id}" class="danger">Hapus</button>`).join("<br>")||"Belum ada data OT.";document.querySelectorAll("[data-delot]").forEach(b=>b.onclick=()=>{data.ot=data.ot.filter(x=>x.id!==b.dataset.delot);save()})}
function renderHolidays(){$("holidayList").innerHTML=data.holidays.map(h=>`<div class="person">${safe(h.date)} — ${safe(h.name)} <button class="danger" data-hdel="${h.date}">Hapus</button></div>`).join("")||'<span class="muted small">Belum ada hari libur.</span>';document.querySelectorAll("[data-hdel]").forEach(b=>b.onclick=()=>{data.holidays=data.holidays.filter(h=>h.date!==b.dataset.hdel);save()})}
function reportRows(){let a=$("reportStart").value||today(),b=$("reportEnd").value||plus(a,6);return data.staff.map(n=>{let c={P:0,S:0,M:0,OFF:0,OT:0,NLS:0,DLS:0};for(let d=a;d<=b;d=plus(d,1))c[getEntry(d,n)]=(c[getEntry(d,n)]||0)+1;c.OT=data.ot.filter(o=>o.name===n&&o.date>=a&&o.date<=b).length;return {n,...c,kerja:c.P+c.S+c.M+c.NLS+c.DLS}})}
function renderReports(){let rows=reportRows();$("reportTable").innerHTML=`<table><thead><tr><th>Karyawan</th><th>P</th><th>S</th><th>M</th><th>NLS</th><th>DLS</th><th>OFF</th><th>OT</th><th>Total kerja</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${safe(r.n)}</td><td>${r.P}</td><td>${r.S}</td><td>${r.M}</td><td>${r.NLS}</td><td>${r.DLS}</td><td>${r.OFF}</td><td>${r.OT}</td><td>${r.kerja}</td></tr>`).join("")}</tbody></table>`}
function csvDownload(filename,rows){let csv=rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
function exportSchedule(){let rows=[["Tanggal","Karyawan","Shift","Jam"]];Object.keys(data.schedule).sort().forEach(d=>data.staff.forEach(n=>{let s=getEntry(d,n);rows.push([d,n,shiftLabel(s),s==="P"?data.settings.shift1:s==="S"?data.settings.shift2:s==="M"?data.settings.shift3:s==="DLS"?data.settings.dls:s==="NLS"?data.settings.nls:"-"])}));csvDownload("jadwal-kerja.csv",rows)}
function printPage(){window.print()}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("hidden",x.id!==b.dataset.tab))});
$("startDate").value=today();$("otDate").value=today();$("reportStart").value=today();$("reportEnd").value=plus(today(),6);
$("generateBtn").onclick=()=>generate(monthCursor.getFullYear()+"-"+String(monthCursor.getMonth()+1).padStart(2,"0")+"-01",new Date(monthCursor.getFullYear(),monthCursor.getMonth()+1,0).getDate());
$("quickGenerate").onclick=()=>{document.querySelector('[data-tab="calendar"]').click();generate(today(),30)};
$("goToday").onclick=()=>document.querySelector('[data-tab="calendar"]').click();
$("quickExport").onclick=exportSchedule;$("exportBtn").onclick=exportSchedule;$("printBtn").onclick=printPage;
$("prevMonth").onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()-1);renderSchedule();renderDashboardRoster()};
$("nextMonth").onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()+1);renderSchedule();renderDashboardRoster()};
$("homePrevMonth").onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()-1);renderSchedule();renderDashboardRoster()};
$("homeNextMonth").onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()+1);renderSchedule();renderDashboardRoster()};
$("dashboardNameFilter").onchange=renderDashboardRoster;
$("addStaff").onclick=()=>{let n=$("newStaff").value.trim();if(!n)return;if(data.staff.includes(n))return alert("Nama sudah ada.");data.staff.push(n);$("newStaff").value="";save()};
$("saveOT").onclick=()=>{let start=$("otStart").value,end=$("otEnd").value;let [sh,sm]=start.split(":").map(Number),[eh,em]=end.split(":").map(Number);let gross=((eh*60+em)-(sh*60+sm)+1440)%1440/60;let rest=Number(data.settings.breakHours??1);let net=gross;data.ot.push({id:crypto.randomUUID(),name:$("otStaff").value,date:$("otDate").value,start,end,gross,rest,net,breakPaid:true});save()};
$("saveSettings").onclick=()=>{data.settings={...data.settings,shift1:$("shift1").value,shift2:$("shift2").value,shift3:$("shift3").value,dls:$("dls").value,nls:$("nls").value,breakHours:Number($("breakHours").value||1),reminderTime:$("reminderTime").value};save();alert("Pengaturan disimpan.")};
["shift1","shift2","shift3","dls","nls","breakHours","reminderTime"].forEach(k=>{if($(k))$(k).value=data.settings[k]??(k==="breakHours"?1:"")});
$("addHoliday").onclick=()=>{let d=$("holidayDate").value;if(!d)return;data.holidays.push({date:d,name:$("holidayName").value||"Hari libur"});save()};
$("runReport").onclick=renderReports;$("reportCSV").onclick=()=>{let r=reportRows();csvDownload("rekap-karyawan.csv",[["Karyawan","P","S","M","NLS","DLS","OFF","OT","Total kerja"],...r.map(x=>[x.n,x.P,x.S,x.M,x.NLS,x.DLS,x.OFF,x.OT,x.kerja])])};$("reportPDF").onclick=printPage;
$("backupBtn").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="backup-jadwal.json";a.click()};
$("resetBtn").onclick=()=>{if(confirm("Hapus semua jadwal, OT, dan hari libur?")){data=structuredClone(defaults);save()}};
$("notifyBtn").onclick=async()=>{if(!("Notification"in window))return alert("Browser ini tidak mendukung notifikasi.");let p=await Notification.requestPermission();alert(p==="granted"?"Notifikasi diizinkan. Buka aplikasi agar pengingat dapat dijalankan.":"Izin notifikasi belum diberikan.")};
function reminder(){if(!("Notification"in window)||Notification.permission!=="granted")return;let now=new Date(),hm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");if(hm===data.settings.reminderTime&&sessionStorage.getItem("mws-reminder")!==today()){sessionStorage.setItem("mws-reminder",today());let s=getEntry(today(),data.staff[0]);new Notification("Pengingat jadwal kerja",{body:"Jadwal hari ini siap dilihat di My Work Schedule."})}}
setInterval(reminder,30000);
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();