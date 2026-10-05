import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile, FileBlob } from '@oai/artifact-tool';
const skill='C:/Users/MukaiLab/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const workspace='C:/Users/MukaiLab/ettotto_skills/artifacts/purple-template';
const tmp=path.join(workspace,'build');
const out=path.join(workspace,'output');
process.env.RUNTIME_NODE_MODULES='C:/Users/MukaiLab/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
process.env.RUNTIME_NODE='C:/Users/MukaiLab/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe';
const {finalizePresentation,applyPresentationChartFont}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
const C={white:'#FFFFFF',ink:'#25232B',muted:'#787480',purple:'#7352B9',pale:'#F3EFFA',line:'#E5E2E9',gray:'#F6F6F8',soft:'#B8A2DF'};
const font='Meiryo';
const p=Presentation.create({slideSize:{width:1280,height:720}});
let serial=0;
function box(s,x,y,w,h,fill=C.gray,line='none',geometry='rect'){
 return s.shapes.add({name:`shape-${++serial}`,geometry,position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:line==='none'?0:1}});
}
function text(s,value,x,y,w,h,size=26,color=C.ink,bold=false,align='left'){
 const a=box(s,x,y,w,h,'none','none','textbox');a.text=value;
 a.text.style={typeface:font,fontSize:size,color,bold,alignment:align,autoFit:'none',verticalAlignment:'middle'};
 return a;
}
function rule(s,x,y,w,color=C.line){box(s,x,y,w,2,color);}
function base(title,n,note){
 const s=p.slides.add();s.background.fill=C.white;
 if(title){text(s,title,72,52,1136,66,38,C.ink,true);box(s,72,134,46,4,C.purple);}
 text(s,String(n),1150,658,58,26,15,C.muted,false,'right');
 s.speakerNotes.textFrame.setText(note+'\nテンプレートの見本文字です。必要なスライドを複製し、内容を差し替えてください。図形・文字は編集可能です。');return s;
}
function card(s,x,y,w,h,heading,body,num){
 box(s,x,y,w,h,C.gray);
 if(num)text(s,num,x+28,y+25,w-56,36,20,C.purple,true);
 text(s,heading,x+28,y+83,w-56,56,30,C.ink,true);
 text(s,body,x+28,y+164,w-56,h-190,24,C.muted);
}
// 1. Cover, using the supplied research topic as an editable example.
{
 const s=base('',1,'レイアウト：表紙。タイトルは2～3行、副題は1行。氏名・所属・日付を更新してください。添付の研究テーマを見本として使用しています。');
 box(s,72,87,56,5,C.purple);
 text(s,'難読化されたWebAssembly\nクリプトジャッキングの\n検知耐性評価',72,142,1136,252,54,C.ink,true);
 text(s,'wasm-mutateによるバイナリ多様化とコード正規化',72,430,1136,62,27,C.muted);
 rule(s,72,570,1136);
 text(s,'氏名 / 所属',72,601,800,40,22,C.ink);
 text(s,'YYYY.MM.DD',950,601,258,40,21,C.muted,false,'right');
}
// 2. Section divider.
{
 const s=base('',2,'レイアウト：章扉。話題が切り替わる位置に配置します。章番号、章タイトル、章で扱う内容を差し替えます。');
 text(s,'01',72,110,250,120,88,C.purple,true);
 text(s,'章タイトル',72,286,1136,95,58,C.ink,true);
 text(s,'この章で伝えることを、ひと言で',72,406,1136,55,29,C.muted);
 rule(s,72,558,1136);
}
// 3. One key message.
{
 const s=base('結論をひと言で',3,'レイアウト：1メッセージ。中央の結論は2行まで。根拠は左右に短く分けて配置します。');
 box(s,72,208,1136,224,C.pale);
 text(s,'最も伝えたいメッセージを\nここに記入',112,244,1056,143,44,C.ink,true);
 text(s,'根拠 01',72,481,520,40,20,C.purple,true);
 text(s,'結論を支える事実を短く',72,530,520,55,27,C.ink);
 text(s,'根拠 02',672,481,536,40,20,C.purple,true);
 text(s,'比較・観察結果をひと言で',672,530,536,55,27,C.ink);
}
// 4. Cards.
{
 const s=base('重要なポイント',4,'レイアウト：3枚のカード。各見出しは短く、説明は2行以内にします。カードの幅と余白を揃えてください。');
 card(s,72,206,360,367,'ポイント 1','短い説明を\n2行以内で記入','01');
 card(s,460,206,360,367,'ポイント 2','短い説明を\n2行以内で記入','02');
 card(s,848,206,360,367,'ポイント 3','短い説明を\n2行以内で記入','03');
}
// 5. Process.
{
 const s=base('実施の流れ',5,'レイアウト：4段階のプロセス。研究の実験工程にも使用できます。ノードとコネクタは編集可能です。');
 const nodes=[];
 ['準備','実施','比較','評価'].forEach((v,i)=>{
  const x=72+i*290; text(s,String(i+1).padStart(2,'0'),x,215,240,45,25,C.purple,true);
  const node=box(s,x,282,266,116,i===3?C.pale:C.gray);nodes.push(node);
  text(s,v,x+20,304,226,66,34,C.ink,true,'center');
  text(s,['対象・条件を定義','手順に沿って実行','結果を並べて確認','結論と課題を整理'][i],x,441,266,78,23,C.muted);
 });
 nodes.slice(0,-1).forEach((v,i)=>s.shapes.connect(v,nodes[i+1],{kind:'straight',fromSide:'right',toSide:'left',line:{fill:C.soft,width:2},tail:{type:'arrow',width:'sm',length:'sm'}}));
}
// 6. Comparison.
{
 const s=base('2つの条件を比較',6,'レイアウト：左右の比較。変異前後、正規化前後などに使えます。同じ観点を同じ高さに揃えます。');
 box(s,72,206,540,364,C.gray);box(s,640,206,568,364,C.pale);
 text(s,'比較条件 A',102,228,480,55,32,C.ink,true);
 text(s,'比較条件 B',670,228,508,55,32,C.purple,true);
 const rows=[['特徴','特徴をひと言で'],['利点','利点をひと言で'],['課題','課題をひと言で']];
 rows.forEach(([k,v],i)=>{const y=318+i*78;[102,670].forEach(x=>{text(s,k,x,y,94,42,21,C.muted);text(s,v,x+108,y,x===102?355:383,42,24,C.ink);});});
 text(s,'比較から分かったことを1文で',72,596,1136,45,27,C.ink,true);
}
// 7. System diagram.
{
 const s=base('全体構成',7,'レイアウト：構成図。左は入力、中央は処理、右は出力。実際の接続条件や境界に合わせて見出し・線を変更してください。');
 box(s,402,196,476,381,C.gray);
 text(s,'処理環境',426,212,420,42,22,C.muted);
 const a=box(s,72,334,266,112,C.pale);text(s,'入力',92,357,226,62,31,C.ink,true,'center');
 const b=box(s,452,308,376,94,C.white,C.line);text(s,'処理 1',472,326,336,54,29,C.ink,true,'center');
 const c=box(s,452,448,376,94,C.white,C.line);text(s,'処理 2',472,466,336,54,29,C.ink,true,'center');
 const d=box(s,944,334,264,112,C.pale);text(s,'出力',964,357,224,62,31,C.ink,true,'center');
 [[a,b,'right','left'],[b,c,'bottom','top'],[b,d,'right','left']].forEach(([f,t,fromSide,toSide])=>s.shapes.connect(f,t,{kind:'elbow',fromSide,toSide,line:{fill:C.soft,width:2},tail:{type:'arrow',width:'sm',length:'sm'}}));
 text(s,'入力対象の説明',72,475,266,55,22,C.muted,false,'center');
 text(s,'出力結果の説明',944,475,264,55,22,C.muted,false,'center');
}
// 8. Metrics.
{
 const s=base('主要な数値',8,'レイアウト：KPI。XXは数値用プレースホルダーです。実測値、単位、対象期間を更新してください。結果を捏造せず、未測定なら未測定と記載します。');
 [72,460,848].forEach((x,i)=>{
  text(s,['指標 1','指標 2','指標 3'][i],x,229,360,45,26,C.ink,true);
  text(s,['XX%','XX件','XX秒'][i],x,314,360,123,70,C.purple,true);
  rule(s,x,470,360);
  text(s,'対象・期間・条件を記入',x,502,360,66,23,C.muted);
 });
}
// 9. Native editable chart.
{
 const s=base('条件別の結果',9,'レイアウト：編集可能な棒グラフ。表示値60・40・70は書式確認用の架空データです。実験結果ではありません。PowerPointの「データの編集」からカテゴリ・値を変更します。');
 text(s,'サンプル値（実測値ではありません）',72,178,800,40,20,C.muted);
 const ch=s.charts.add('bar',{
  position:{left:72,top:243,width:740,height:330},categories:['条件 A','条件 B','条件 C'],
  series:[{name:'サンプル値',values:[60,40,70],fill:C.purple}],
  barOptions:{direction:'column',grouping:'clustered',gapWidth:180},hasLegend:false,
  chartFill:C.white,plotAreaFill:C.white,
  xAxis:{textStyle:{typeface:font,fontSize:20,fill:C.muted}},
  yAxis:{minimumScale:0,maximumScale:100,majorUnit:25,numberFormatCode:'0',textStyle:{typeface:font,fontSize:18,fill:C.muted}},
  dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:font,fontSize:22,fill:C.ink}}
 });applyPresentationChartFont(ch,{fontFamily:font});
 box(s,880,243,328,330,C.pale);
 text(s,'読み取り',908,269,272,50,27,C.purple,true);
 text(s,'グラフから分かる\nことを短く記入',908,356,272,128,28,C.ink,true);
 text(s,'単位・測定条件・出典を記入',72,604,1136,32,18,C.muted);
}
// 10. Timeline.
{
 const s=base('今後のスケジュール',10,'レイアウト：ロードマップ。月・期間と作業内容を差し替えます。紫は現在または重点期間です。');
 const xs=[72,362,652,942];
 rule(s,85,329,1110,C.line);
 xs.forEach((x,i)=>{
  text(s,['期間 1','期間 2','期間 3','期間 4'][i],x,219,266,45,24,i===1?C.purple:C.muted,true);
  box(s,x+10,319,22,22,i===1?C.purple:C.soft,'none','ellipse');
  text(s,['準備','実験','分析','報告'][i],x,380,266,62,33,C.ink,true);
  text(s,'実施内容を\n2行以内で記入',x,461,266,96,24,C.muted);
 });
}
// 11. Closing.
{
 const s=base('まとめ・相談事項',11,'レイアウト：まとめ。結論は1文、相談事項は2点程度。最後に次の行動や質問を具体的に示します。');
 box(s,72,205,1136,163,C.pale);
 text(s,'今日伝えたい結論を1文で',108,247,1064,80,40,C.ink,true);
 text(s,'相談事項 1',72,424,520,46,26,C.purple,true);
 text(s,'確認したいことを短く記入',72,484,520,72,27,C.ink);
 text(s,'相談事項 2',672,424,536,46,26,C.purple,true);
 text(s,'助言が欲しい点を短く記入',672,484,536,72,27,C.ink);
}
// 12. Design guide, also editable.
{
 const s=base('テンプレートの使い方',12,'このガイドは発表前に削除してください。必要なスライドを複製し、見本文字を置換します。タイトルや本文を短くし、図解を大きく保ちます。研究テーマの30枚分の本文を作成した資料ではなく、汎用レイアウト集です。');
 text(s,'配色',72,207,490,45,27,C.ink,true);
 [C.white,C.ink,C.muted,C.purple,C.pale].forEach((color,i)=>{
  box(s,72+i*102,283,78,62,color,C.line);
  text(s,['白','本文','補足','紫','淡紫'][i],72+i*102,354,78,38,17,C.muted,false,'center');
 });
 text(s,'余白と文字',672,207,536,45,27,C.ink,true);
 text(s,'左右の余白 72 px\n見出し 28.5 pt / 本文 18–21 pt\nフォント Meiryo / 比率 16:9',672,279,536,136,24,C.muted);
 rule(s,72,454,1136);
 text(s,'必要なページを複製して、見本文字を差し替え',72,496,1136,48,28,C.ink,true);
 text(s,'1枚に1メッセージ。説明は短く、図解は大きく。',72,561,1136,47,26,C.muted);
}
await fs.mkdir(out,{recursive:true});
const candidate=path.join(tmp,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
const final=path.join(out,'White_Purple_Template_v3.pptx');
const result=await finalizePresentation({workspaceDir:workspace,candidatePath:candidate,finalPath:final,
 pythonExecutable:'C:/Users/MukaiLab/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],
 requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[9],materializeLiteralChartWorkbooks:true,
 fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,
 receiptPath:path.join(tmp,'validation-v3.json')});
console.log(JSON.stringify(result));
const finalDeck=await PresentationFile.importPptx(await FileBlob.load(final));
for(let i=0;i<finalDeck.slides.items.length;i++){
 const b=await finalDeck.export({slide:finalDeck.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(tmp,`slide-${i+1}.png`),new Uint8Array(await b.arrayBuffer()));
}
console.log('Rendered all final slides.');
