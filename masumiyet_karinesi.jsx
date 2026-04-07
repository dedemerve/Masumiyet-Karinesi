<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Masumiyet Karinesi — Confusion Matrix</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #111; }

    .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
    .subtitle { color: #6b7280; font-size: 0.875rem; margin-bottom: 2rem; }

    .matrix-wrap { width: 100%; max-width: 640px; }

    .axis-title { text-align: center; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin-bottom: 0.25rem; }
    .col-labels { display: flex; padding-left: 7rem; margin-bottom: 0.5rem; }
    .col-label { flex: 1; text-align: center; font-size: 0.875rem; font-weight: 700; }
    .col-label.mahkum { color: #ef4444; }
    .col-label.masum  { color: #16a34a; }

    .grid-area { display: flex; }
    .row-axis { display: flex; flex-direction: column; justify-content: center; align-items: flex-end; padding-right: 0.5rem; width: 7rem; }
    .row-axis-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; writing-mode: vertical-rl; transform: rotate(180deg); height: 80px; }
    .rows { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    .row { display: flex; gap: 0.5rem; }
    .row-label { width: 4rem; display: flex; align-items: center; justify-content: flex-end; padding-right: 0.5rem; font-size: 0.875rem; font-weight: 700; }
    .row-label.suclu { color: #ef4444; }
    .row-label.masum-r { color: #16a34a; }

    .cell { flex: 1; border-radius: 0.75rem; border: 2px solid; padding: 1rem; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; min-height: 100px; }
    .cell:hover { transform: scale(1.04); box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
    .cell.tp { background: #dcfce7; border-color: #4ade80; }
    .cell.fp { background: #fecaca; border-color: #dc2626; box-shadow: 0 0 0 3px #ef4444; }
    .cell.fn { background: #fef9c3; border-color: #facc15; }
    .cell.tn { background: #dcfce7; border-color: #4ade80; }

    .cell-tag { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; }
    .tag-tp, .tag-tn { color: #166534; }
    .tag-fp { color: #991b1b; }
    .tag-fn { color: #854d0e; }

    .cell-title { font-size: 0.875rem; font-weight: 600; color: #1f2937; line-height: 1.3; }
    .cell-sub   { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }

    .detail-box { margin-top: 1.5rem; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1.25rem; min-height: 5rem; }
    .detail-title { font-size: 0.875rem; font-weight: 700; color: #111; margin-bottom: 0.25rem; }
    .detail-text  { font-size: 0.75rem; color: #4b5563; white-space: pre-line; }
    .detail-placeholder { font-size: 0.75rem; color: #9ca3af; }

    .legend { margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; }
    .legend-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.75rem; color: #6b7280; }
    .legend-item.full { grid-column: span 2; text-align: center; }
    .leg-fp { color: #ef4444; font-weight: 700; }
    .leg-fn { color: #ca8a04; font-weight: 700; }
    .leg-em { color: #111; font-weight: 600; }
    .leg-blue { color: #2563eb; font-weight: 600; }
  </style>
</head>
<body>
<div id="root"></div>

<script type="text/babel">
const CELLS = {
  TP: {
    cls: "tp", tag: "TP", tagCls: "tag-tp",
    title: "Doğru Mahkûmiyet",
    sub: "Gerçekten suçlu → Mahkûm edildi",
    detail: "Adalet sağlandı. Suçlu cezasını çekiyor."
  },
  FP: {
    cls: "fp", tag: "FP ⚠️", tagCls: "tag-fp",
    title: "Yanlış Mahkûmiyet",
    sub: "Masum kişi → Mahkûm edildi",
    detail: "⚠️ MASUMİYET KARİNESİNİN İHLALİ\nDevletin kanıtlama yükümlülüğünü yerine getirememesi. En ağır hata."
  },
  FN: {
    cls: "fn", tag: "FN", tagCls: "tag-fn",
    title: "Yanlış Beraat",
    sub: "Gerçekten suçlu → Masum sayıldı",
    detail: "Suçlu beraat etti ve serbest kaldı. Tercih edilen hata türü — sistem bilinçli olarak bunu göze alır."
  },
  TN: {
    cls: "tn", tag: "TN", tagCls: "tag-tn",
    title: "Doğru Beraat",
    sub: "Masum kişi → Masum sayıldı",
    detail: "Masum kişi beraat etti. Masumiyet karinesi korundu. Sistem doğru çalıştı."
  },
};

function App() {
  const [hovered, setHovered] = React.useState(null);

  const rows = [
    { label: "Suçlu", labelCls: "suclu",   keys: ["TP", "FN"] },
    { label: "Masum", labelCls: "masum-r",  keys: ["FP", "TN"] },
  ];

  return (
    <div className="page">
      <h1>Masumiyet Karinesi</h1>
      <p className="subtitle"><em>"Şüpheden sanık yararlanır"</em> — Confusion Matrix ile</p>

      <div className="matrix-wrap">
        <div className="axis-title">Mahkeme Kararı</div>
        <div className="col-labels">
          <div className="col-label mahkum">Mahkûm</div>
          <div className="col-label masum">Masum</div>
        </div>

        <div className="grid-area">
          <div className="row-axis">
            <span className="row-axis-label">Gerçek Durum</span>
          </div>
          <div className="rows">
            {rows.map(({ label, labelCls, keys }) => (
              <div className="row" key={label}>
                <div className={`row-label ${labelCls}`}>{label}</div>
                {keys.map(k => {
                  const c = CELLS[k];
                  return (
                    <div
                      key={k}
                      className={`cell ${c.cls}`}
                      onMouseEnter={() => setHovered(k)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className={`cell-tag ${c.tagCls}`}>{c.tag}</div>
                      <div className="cell-title">{c.title}</div>
                      <div className="cell-sub">{c.sub}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="detail-box">
          {hovered ? (
            <>
              <div className="detail-title">{CELLS[hovered].title}</div>
              <div className="detail-text">{CELLS[hovered].detail}</div>
            </>
          ) : (
            <span className="detail-placeholder">Bir hücrenin üzerine gelin, açıklamasını görün.</span>
          )}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="leg-fp">FP (False Positive)</span> — Tip I Hata<br/>
            Masum birini mahkûm etmek. Hukuk bu hatayı <span className="leg-em">en ağır</span> kabul eder.
          </div>
          <div className="legend-item">
            <span className="leg-fn">FN (False Negative)</span> — Tip II Hata<br/>
            Suçluyu beraat ettirmek. Sistem bunu <span className="leg-em">bilinçli tolere</span> eder.
          </div>
          <div className="legend-item full">
            <span className="leg-blue">"10 suçlu beraat etsin, 1 masum mahkûm edilmesin."</span>
            <span style={{color:'#9ca3af'}}> — Blackstone's Ratio</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
</script>
</body>
</html>
