
import { useState } from "react";

const cell = (bg, border, title, subtitle, detail, highlight) => ({
  bg, border, title, subtitle, detail, highlight
});

const cells = {
  TP: cell(
    "bg-green-100", "border-green-400",
    "Doğru Mahkûmiyet",
    "Gerçekten suçlu → Mahkûm edildi",
    "Adalet sağlandı. Suçlu cezasını çekiyor.",
    false
  ),
  FP: cell(
    "bg-red-200", "border-red-600",
    "Yanlış Mahkûmiyet",
    "Masum kişi → Mahkûm edildi",
    "⚠️ MASUMİYET KARİNESİNİN İHLALİ\nDevletin kanıtlama yükümlülüğünü yerine getirememesi. En ağır hata.",
    true
  ),
  FN: cell(
    "bg-yellow-100", "border-yellow-400",
    "Yanlış Beraat",
    "Gerçekten suçlu → Masum sayıldı",
    "Suçlu beraat etti ve serbest kaldı. Tercih edilen hata türü — sistem bilinçli olarak bunu göze alır.",
    false
  ),
  TN: cell(
    "bg-green-100", "border-green-400",
    "Doğru Beraat",
    "Masum kişi → Masum sayıldı",
    "Masum kişi beraat etti. Masumiyet karinesi korundu. Sistem doğru çalıştı.",
    false
  ),
};

export default function App() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-2xl font-bold mb-1 tracking-tight text-gray-900">Masumiyet Karinesi</h1>
      <p className="text-gray-500 text-sm mb-8">
        <span className="italic">"Şüpheden sanık yararlanır"</span> — Confusion Matrix ile
      </p>

      <div className="flex flex-col items-center w-full max-w-2xl">

        <div className="flex w-full mb-1 pl-28">
          <div className="flex-1 text-center text-xs font-semibold text-blue-600 uppercase tracking-widest">Mahkeme Kararı</div>
        </div>
        <div className="flex w-full mb-2 pl-28">
          <div className="flex-1 text-center text-sm font-bold text-red-500">Mahkûm</div>
          <div className="flex-1 text-center text-sm font-bold text-green-600">Masum</div>
        </div>

        <div className="flex w-full gap-0">
          <div className="flex flex-col justify-center items-end pr-3 w-28 gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest" style={{writingMode:'vertical-rl', transform:'rotate(180deg)', height: 90}}>Gerçek Durum</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {[
              { label: "Suçlu", labelColor: "text-red-500", keys: ["TP", "FN"] },
              { label: "Masum", labelColor: "text-green-600", keys: ["FP", "TN"] },
            ].map(({ label, labelColor, keys }) => (
              <div key={label} className="flex gap-2">
                <div className={`w-16 flex items-center justify-end pr-2 text-sm font-bold ${labelColor}`}>{label}</div>
                {keys.map((k) => {
                  const c = cells[k];
                  return (
                    <div
                      key={k}
                      onMouseEnter={() => setHovered(k)}
                      onMouseLeave={() => setHovered(null)}
                      className={`flex-1 rounded-xl border-2 ${c.bg} ${c.border} p-4 cursor-pointer transition-all duration-200 ${hovered === k ? "scale-105 shadow-lg" : ""} ${c.highlight ? "ring-4 ring-red-500 ring-offset-2 ring-offset-white" : ""}`}
                      style={{ minHeight: 100 }}
                    >
                      <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${k === "FP" ? "text-red-700" : k === "TP" || k === "TN" ? "text-green-800" : "text-yellow-700"}`}>
                        {k === "TP" ? "TP" : k === "FP" ? "FP ⚠️" : k === "FN" ? "FN" : "TN"}
                      </div>
                      <div className="text-gray-800 font-semibold text-sm leading-tight">{c.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{c.subtitle}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 w-full rounded-xl bg-gray-100 border border-gray-200 p-5 min-h-20 transition-all duration-200">
          {hovered ? (
            <>
              <div className="text-sm font-bold text-gray-900 mb-1">{cells[hovered].title}</div>
              <div className="text-xs text-gray-600 whitespace-pre-line">{cells[hovered].detail}</div>
            </>
          ) : (
            <p className="text-gray-400 text-xs">Bir hücrenin üzerine gelin, açıklamasını görün.</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 w-full text-xs text-gray-500">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-red-500 font-bold">FP (False Positive)</span> — Tip I Hata<br/>
            Masum birini mahkûm etmek. Hukuk bu hatayı <span className="text-gray-900 font-semibold">en ağır</span> kabul eder.
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-yellow-600 font-bold">FN (False Negative)</span> — Tip II Hata<br/>
            Suçluyu beraat ettirmek. Sistem bunu <span className="text-gray-900 font-semibold">bilinçli tolere</span> eder.
          </div>
          <div className="col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <span className="text-blue-600 font-semibold">"10 suçlu beraat etsin, 1 masum mahkûm edilmesin."</span>
            <span className="text-gray-400"> — Blackstone's Ratio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
