import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
const root='C:/Users/MukaiLab/ettotto_skills';
process.env.RUNTIME_NODE_MODULES='C:/Users/MukaiLab/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const skill='C:/Users/MukaiLab/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(skill+'/container_tools/artifact_tool_utils.mjs'));
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={ink:'#25232C',sub:'#77717F',purple:'#7545B8',light:'#F4EFFA',gray:'#F5F5F7',line:'#DDD7E5'};
const font='Yu Gothic';
function rect(s,x,y,w,h,fill=C.light){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false){const q=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=t;q.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none'};return q;}
function base(title,msg,n){const s=p.slides.add();s.background.fill='#FFFFFF';text(s,title,72,48,1136,74,40,C.ink,true);rect(s,72,135,60,4,C.purple);if(msg)text(s,msg,72,166,1120,76,27,C.sub);text(s,String(n).padStart(2,'0'),1150,656,60,30,18,C.sub);return s;}
function cards(s,items,y=288){const gap=24,w=(1136-gap*(items.length-1))/items.length;items.forEach(([a,b],i)=>{const x=72+i*(w+gap);rect(s,x,y,w,270,i===0?C.light:C.gray);text(s,a,x+26,y+28,w-52,74,30,C.purple,true);text(s,b,x+26,y+112,w-52,130,25);});}
function rows(s,items,y=266){items.forEach(([a,b],i)=>{const yy=y+i*78;rect(s,72,yy,1136,1,C.line);text(s,a,88,yy+16,274,52,25,C.purple,true);text(s,b,370,yy+16,814,52,25);});}
function flow(s,items,y=306){const gap=32,w=(1136-gap*(items.length-1))/items.length;items.forEach(([a,b],i)=>{const x=72+i*(w+gap);if(i)rect(s,x-gap,y+77,gap,2,C.line);rect(s,x,y,w,204,i===0?C.light:C.gray);text(s,String(i+1).padStart(2,'0'),x+22,y+20,w-44,40,24,C.purple,true);text(s,a,x+22,y+66,w-44,64,28,C.ink,true);text(s,b,x+22,y+139,w-44,60,22,C.sub);});}
function note(s,t){text(s,t,72,610,1090,40,19,C.sub);}
let s=base('研究発表テンプレート','',1);text(s,'難読化されたWebAssembly\nクリプトジャッキングの\n検知耐性評価',72,182,1090,245,52,C.ink,true);text(s,'wasm-mutateによるバイナリ多様化とコード正規化',72,455,1100,65,28,C.purple);text(s,'［氏名］  ［所属］\n［発表日］',72,569,900,66,22,C.sub);
s=base('研究の全体像','コードの形を変えたときの検知結果と、正規化の効果を比較する',2);flow(s,[['検体','元Wasmを用意'],['変異','意味を保つ変形'],['評価','実製品で比較'],['正規化','共通表現で再評価']]);
s=base('今日の相談事項','実験設計を固めるために、StarBEDでの運用条件を確認する',3);cards(s,[['ネットワーク','実験系と管理系の分離\nEDRの外部接続'],['観測','ログ収集\n時刻同期'],['実験運用','安全性と再現性\n実験規模と復元方法']]);
s=base('WebAssemblyとは','Wasmは、ブラウザ内外で動くバイナリ命令形式',4);flow(s,[['ソース','C/C++、Rustなど'],['コンパイル','WebAssembly'],['実行','ブラウザ・ランタイム']]);note(s,'出典：https://webassembly.org/');
s=base('ブラウザ内でWasmが動く仕組み','HTML・JavaScript・Wasmが連携して計算を実行する',5);flow(s,[['HTML','ページを取得'],['JavaScript','Wasmをロード'],['Web Worker','計算を実行'],['WebSocket','サービスと通信']]);
s=base('Wasmの用途と悪用','用途と利用者の同意を踏まえて、悪性を判断する',6);cards(s,[['正当な用途','ゲーム・画像処理\n動画処理・科学計算'],['悪用の例','無断マイニング\nマルウェア処理の隠蔽']]);
s=base('クリプトジャッキングの関係図','利用者の同意なく計算資源をマイニングに使用する',7);flow(s,[['配信サーバー','ページとWasmを配信'],['利用者のブラウザ','計算資源を消費'],['マイニングプール','計算結果を受信']]);note(s,'実験では、配信・実行・プールを管理下の環境に置く');
s=base('検知が難しい理由','コードの特徴と実行時の挙動の両方を確認する必要がある',8);cards(s,[['外見の変化','バイナリ多様化\n処理の分散'],['挙動の重なり','高負荷な良性計算\n暗号処理の多様性'],['判定の条件','利用者の同意\nCPU負荷だけの誤検知']]);
s=base('既存の検知方式','検知器が参照する特徴によって、変異の影響は異なる',9);rows(s,[['静的特徴','ハッシュ、シグネチャ、命令、バイナリ画像'],['動的特徴','CPU使用率、通信、実行時イベント'],['意味ベース解析','ハッシュ処理などの意味を解析するMinerRay']]);note(s,'出典：MinerRay論文（添付資料のURL参照）');
s=base('元となる先行研究','Wasmの多様化による検知回避を報告している',10);text(s,'WebAssembly Diversification\nfor Malware Evasion',72,280,1100,132,39,C.purple,true);rows(s,[['変異・探索','wasm-mutateと探索アルゴリズム'],['評価対象','VirusTotal、MINOS']],447);note(s,'出典：Computers & Security, S0167404823002067／数値は原論文確認後に追記');
s=base('wasm-mutateの役割','異なる形のWasmを生成し、変異条件を管理する',11);cards(s,[['入力','元Wasm\n乱数seed'],['変異','wasm-tools内の変異器\n意味保存オプション'],['出力','変異体\n検証結果・生成履歴']]);note(s,'出典：https://github.com/bytecodealliance/wasm-tools');
s=base('先行研究と今回の評価範囲','実製品のブラウザ実行時の反応と、正規化の効果を調べる',12);cards(s,[['先行研究','研究用検知器\nファイルスキャン'],['今回の評価','EDR・アンチウイルス\nブラウザ実行と遅延検知'],['防御手法','コード正規化\n検知結果の回復']]);
s=base('研究目的','変異前後と正規化前後を、同じ条件で比較する',13);text(s,'検知結果の変化と\n正規化による回復可能性を測定',72,285,1110,145,47,C.purple,true);text(s,'機能の維持と性能低下を併せて確認する',72,478,1100,72,31);
s=base('研究全体の位置付け','調査、制御実験、正規化の評価を接続する',14);flow(s,[['Phase 1','検体・難読化手法の調査'],['Phase 2','StarBEDで実製品を評価'],['Phase 3','コード正規化を評価']]);note(s,'現在位置：［該当するPhaseを強調］');
s=base('リサーチクエスチョン','観測できる結果に基づいて、四つの問いに答える',15);rows(s,[['RQ1  構造','wasm-mutateはどのような構造変化を生成するか'],['RQ2  機能・性能','変異後も機能と性能は維持されるか'],['RQ3  検知','変異によってEDR・AVの検知結果は変化するか'],['RQ4  正規化','正規化によって検知結果を回復できるか']]);
s=base('検証前の仮説','以下は実験で検証する仮説',16);rows(s,[['H1','変異回数が増えるとバイナリ類似度が低下する'],['H2','一部の変異体は機能を維持したまま検知を回避する'],['H3','動的・意味ベース検知は変異の影響を受けにくい'],['H4','正規化で元Wasmに近い特徴を回復できる']]);
s=base('評価パイプライン','生成から判定までの履歴をrun_idで結び付ける',17);flow(s,[['生成','元Wasm・変異体'],['検証','妥当性・意味保存'],['実行','ブラウザで実行'],['観測','検知・accepted share']],279);rect(s,72,528,1136,58,C.light);text(s,'正規化した変異体にも、同じ検証・実行・観測を適用',98,539,1080,44,26,C.purple,true);
s=base('評価対象の検体','出所と選定条件を固定し、元検体を識別する',18);cards(s,[['検体候補','先行研究の実行可能検体\n管理下の模擬検体'],['記録項目','SHA-256\nアルゴリズム・コンパイラ\nJSラッパーのバージョン']]);note(s,'第三者の環境に接続しない構成で評価する');
s=base('変異体の生成条件','再生成に必要なパラメータと失敗を記録する',19);rows(s,[['生成規模','元検体数［ ］  変異体数［ ］  変異回数［ ］'],['変異条件','seed［ ］  意味保存［有・無］  探索条件［ ］'],['失敗の扱い','生成失敗・検証失敗を記録して分母を明示'],['識別情報','元検体ID、変異体ID、SHA-256の対応を保存']]);
s=base('コード正規化モジュール','異なる表現を共通表現へ近づける',20);cards(s,[['正規化前','［WATの命令列を挿入］\n変異による表現の違い'],['正規化後','［正規化後のWATを挿入］\n整理した命令列']]);note(s,'対象候補：不要命令・到達不能コード・定数式／実装済み範囲［ ］');
s=base('実験群','難読化と正規化の効果を切り分ける',21);rows(s,[['A  基準','元Wasm'],['B・C  変異','B：ランダム生成  C：検知回避を探索'],['D  正規化','変異体を正規化したもの'],['E  良性','良性Wasmによる誤検知の確認']]);
s=base('StarBEDを使用する理由','隔離と再構築を前提に、通信とホストを観測する',22);cards(s,[['分離','管理系と実験系\n外部への影響を抑制'],['再構築','KVMによる環境復元\n条件と時刻の統一'],['観測','パケット\nホストイベント']]);note(s,'出典：StarBED設備概要（添付資料のURL参照）');
s=base('物理・仮想構成案','X087の1物理ノード上にKVM/libvirt環境を構築する',23);rect(s,72,272,1136,308,C.gray);text(s,'X087  /  KVM・libvirt',98,290,900,46,27,C.ink,true);const vl=[['VLAN 3305','Web配信'],['VLAN 3306','マイニング'],['VLAN 3307','VM管理・観測']];vl.forEach(([a,b],i)=>{const x=98+i*368;rect(s,x,369,340,140,C.light);text(s,a,x+24,387,292,45,28,C.purple,true);text(s,b,x+24,449,292,42,26);});note(s,'bus4.0：施設管理用／EXP_IF：実験用25GbE／設計案として要確認');
s=base('VM間の通信経路案','実験通信と管理・観測通信を論理的に分離する',24);rows(s,[['Web配信  3305','10.33.5.10  から  被害者10.33.5.20  ／ TCP 7676'],['計算通信  3306','被害者10.33.6.20  と  プール10.33.6.10 ／ TCP 8892'],['観測  3307','被害者10.33.7.20  と  観測VM10.33.7.40 ／ TCP 5986']]);note(s,'同一ホスト内：Linux bridgeでL2転送／ポートと経路は設計案');
s=base('EDR・アンチウイルスの評価条件','検知に影響する設定を実験時点で保存する',25);cards(s,[['製品','製品・エージェント\nエンジン・シグネチャ\n［名称・バージョン］'],['端末','OSビルド\nブラウザ\n［名称・バージョン］'],['保護・接続','リアルタイム・クラウド\nProxy・外部通信\n［設定とポリシー］']]);
s=base('観測するイベント','製品アラートと実行の証拠を同じrun_idで集約する',26);cards(s,[['端末','EDR・AVの検知と遮断\nWindows Event Log\nSysmon'],['サービス','HTTP配信\nWebSocket接続\naccepted / rejected'],['ホスト','pcap\n開始・終了時刻\nrun_id']]);
s=base('判定基準','実行成功と防御製品の反応を別々に判定する',27);rows(s,[['完全回避','accepted shareあり、警告・遮断なし'],['部分回避','警告あり、実行は継続'],['防御成功','隔離・削除・通信遮断'],['機能失敗・遅延','shareなし／終了後に警告を確認']]);note(s,'実行：1000秒（計画値）／終了後の観測時間：［ ］秒');
s=base('評価指標と再現性','検知・機能・性能・構造を同じ条件で比較する',28);cards(s,[['検知','検知率・遮断率\n正規化による回復率'],['実行','accepted share率\nhashes/s・実行時間'],['構造','バイナリサイズ\n命令列・CFG・類似度']]);note(s,'seed・設定・ログ・VMイメージを保存／順序をランダム化して反復');
s=base('現在地と残る課題','進捗とマイルストーンを更新して使う',29);rows(s,[['完了','先行研究調査'],['進行中','Wasm正規化モジュール'],['設計済み','KVM・VLAN・IP構成'],['未完了・未決定','製品選定、観測VM、自動実験、EDR外部接続']]);note(s,'添付資料の進捗を記載／次のマイルストーン：［内容］［期限］');
s=base('NICT・StarBED担当者への相談','構成・接続・観測・復元の運用条件を確認する',30);cards(s,[['構成','物理VLANの利用要否\nbus4.0と管理系の分離\n観測VMの配置'],['接続・観測','EDRのProxy利用\nログとpcapの時刻同期'],['運用','実験後のVM復元\n避けるべき構成・通信']]);
const attachment='提供資料：30枚構成（貼り付けたテキスト.txt）。計画・仮説・進捗は提供資料に基づく。［ ］は差し替え欄。';
for (const slide of p.slides.items)slide.speakerNotes.textFrame.setText(attachment);
const citations={4:'https://webassembly.org/',9:'https://d3ccyth396mz21.cloudfront.net/publications/minerray-semantics-aware-analysis-for-ever-evolving-cryptojacking-detection',10:'https://www.sciencedirect.com/science/article/pii/S0167404823002067',11:'https://github.com/bytecodealliance/wasm-tools',22:'https://starbed.nict.go.jp/archives/starbed4/en/equipment/index.html'};
for(const [n,url] of Object.entries(citations))p.slides.items[Number(n)-1].speakerNotes.textFrame.setText(attachment+'\n添付資料が示す出典：'+url);
await fs.mkdir(root+'/.build-slides/renders',{recursive:true});
await (await PresentationFile.exportPptx(p)).save(root+'/.build-slides/candidate.pptx');
console.log('draft saved');
for(let i=0;i<p.slides.items.length;i++){const slide=p.slides.items[i];const img=await p.export({slide,format:'png',scale:1});await fs.writeFile(root+'/.build-slides/renders/'+String(i+1).padStart(2,'0')+'.png',new Uint8Array(await img.arrayBuffer()));}
console.log('30 renders saved');
const result=await finalizePresentation({workspaceDir:root,candidatePath:root+'/.build-slides/candidate.pptx',finalPath:root+'/outputs/Wasm_研究発表テンプレート_30枚_完成版.pptx',pythonExecutable:'C:/Users/MukaiLab/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],explicitTotalSlideCount:30,fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:root+'/.build-slides/validation-final.json'});
console.log(JSON.stringify(result));
