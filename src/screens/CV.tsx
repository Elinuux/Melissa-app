import { useEffect, useRef, useState } from 'react';
import { Card } from '../components/Card';
import type { CVSection } from '../types';
import { aiService } from '../services/aiService';
import { cvAsText, getCVMeta, getOriginalCV, loadCVSections, saveCVSections, saveOriginalCV } from '../services/cvService';

interface ParsedSuggestion { sectionId:string; after:string; reason?:string; }

export function CV() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [meta, setMeta] = useState(getCVMeta);
  const [sections, setSections] = useState<CVSection[]>(loadCVSections);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<ParsedSuggestion[]>([]);
  const [rawSuggestion, setRawSuggestion] = useState('');
  const [working, setWorking] = useState(false);
  const [offerText, setOfferText] = useState('');

  useEffect(() => { saveCVSections(sections); }, [sections]);
  useEffect(() => {
    let currentUrl = '';
    void getOriginalCV().then((blob) => {
      if (blob && meta?.type === 'application/pdf') {
        currentUrl = URL.createObjectURL(blob);
        setPreviewUrl(currentUrl);
      }
    });
    return () => { if (currentUrl) URL.revokeObjectURL(currentUrl); };
  }, [meta]);

  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      const saved = await saveOriginalCV(file);
      setMeta(saved);
      setMessage('CV original conservé. Tu peux maintenant travailler sur la version éditable sans écraser le fichier importé.');
    } catch {
      setMessage('Choisis un CV au format PDF ou DOCX.');
    }
  };

  const updateSection = (id: string, content: string) => setSections((current) => current.map((section) => section.id === id ? { ...section, content } : section));
  const removeSection = (id: string) => setSections((current) => current.filter((section) => section.id !== id));
  const move = (index: number, direction: -1 | 1) => setSections((current) => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const copy = [...current];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
  });
  const addSection = () => setSections((current) => [...current, { id:crypto.randomUUID(), type:'other', title:'Nouvelle section', content:'' }]);

  const prepareAI = () => {
    setMessage('');
    setSuggestions([]);
    setRawSuggestion('');
    if (!aiService.available) {
      setMessage('Assistant IA prêt dans l’application, mais aucune clé IA serveur n’est encore activée. Le CV reste entièrement modifiable sans IA.');
      return false;
    }
    return true;
  };

  const applyAIResult = (text: string) => {
    const parsed = parseSuggestions(text);
    if (parsed.length) setSuggestions(parsed); else setRawSuggestion(text);
  };

  const improve = async () => {
    if (!prepareAI()) return;
    setWorking(true);
    try {
      const result = await aiService.improveCV(cvAsText(sections));
      applyAIResult(result.text);
    } catch {
      setMessage('L’assistant IA est momentanément indisponible. Ton CV n’a pas été modifié.');
    } finally { setWorking(false); }
  };

  const adaptToOffer = async () => {
    if (!offerText.trim()) { setMessage('Colle d’abord le texte de l’annonce à laquelle tu veux adapter le CV.'); return; }
    if (!prepareAI()) return;
    setWorking(true);
    try {
      const result = await aiService.adaptCV(cvAsText(sections), offerText.trim());
      applyAIResult(result.text);
    } catch {
      setMessage('L’adaptation IA est momentanément indisponible. Ton CV n’a pas été modifié.');
    } finally { setWorking(false); }
  };

  const accept = (suggestion: ParsedSuggestion) => {
    setSections((current) => current.map((section) => section.id === suggestion.sectionId ? { ...section, content:suggestion.after } : section));
    setSuggestions((current) => current.filter((item) => item !== suggestion));
  };

  const downloadOriginal = async () => {
    const blob = await getOriginalCV();
    if (!blob || !meta) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = meta.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportPDF = () => {
    const html = sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><div>${escapeHtml(section.content).replace(/\n/g,'<br>')}</div></section>`).join('');
    const popup = window.open('', '_blank');
    if (!popup) { setMessage('Autorise l’ouverture de la fenêtre pour exporter le CV.'); return; }
    popup.document.write(`<!doctype html><html><head><title>CV Mélissa</title><style>@page{size:A4;margin:15mm}body{font-family:Arial,sans-serif;color:#171717;line-height:1.4;font-size:11pt}h2{font-size:14pt;border-bottom:1px solid #ddd;padding-bottom:4px;margin:16px 0 7px}section:first-child h2{border:0;font-size:20pt}div{white-space:normal}</style></head><body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  };

  return <section className="cv-space">
    <Card className="cv-hero">
      <div className="section-heading"><div><p className="eyebrow">MON CV</p><h2>{meta ? meta.name : 'Ajoute ton CV principal'}</h2></div><span className="cv-icon">CV</span></div>
      <p className="muted">Le fichier original reste intact. Les adaptations sont travaillées séparément.</p>
      <input ref={fileRef} className="visually-hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => void importFile(event.target.files?.[0])} />
      <button className="primary" onClick={() => fileRef.current?.click()}>{meta ? 'IMPORTER UNE NOUVELLE VERSION' : 'IMPORTER MON CV'}</button>
      {meta && <div className="cv-file-meta"><span>{Math.max(1, Math.round(meta.size / 1024))} Ko</span><span>Importé le {new Date(meta.importedAt).toLocaleDateString('fr-FR')}</span></div>}
    </Card>

    {previewUrl && <Card><p className="eyebrow">APERÇU ORIGINAL</p><iframe className="cv-preview" src={previewUrl} title="Aperçu du CV original" /></Card>}

    <div className="section-heading"><div><p className="eyebrow">VERSION ÉDITABLE</p><h2>Modifier mon CV</h2></div><button className="icon-button" onClick={addSection}>＋</button></div>
    {sections.map((section, index) => <Card key={section.id} className="cv-section-card">
      <div className="cv-section-head"><input className="cv-section-title" value={section.title} onChange={(event) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, title:event.target.value } : item))}/><div className="cv-reorder"><button onClick={() => move(index,-1)} disabled={index===0}>↑</button><button onClick={() => move(index,1)} disabled={index===sections.length-1}>↓</button><button onClick={() => removeSection(section.id)} aria-label="Supprimer la section">×</button></div></div>
      <textarea className="cv-editor" value={section.content} onChange={(event) => updateSection(section.id,event.target.value)} placeholder={`Contenu — ${section.title}`} />
    </Card>)}

    <Card className="ai-card">
      <p className="eyebrow">ASSISTANT INTELLIGENT</p><h2>Améliorer mon CV</h2>
      <p className="muted">Il peut proposer des formulations, mots-clés et améliorations, sans inventer de diplôme, d’expérience ou de compétence.</p>
      <button className="primary" onClick={() => void improve()} disabled={working}>{working ? 'ANALYSE…' : 'ANALYSER MON CV'}</button>
      {!aiService.available && <small className="ai-provider-note">OpenAI · Gemini · Claude prêts à être activés côté serveur</small>}
    </Card>

    <Card className="ai-card offer-adapt-card">
      <p className="eyebrow">ADAPTATION À UNE OFFRE</p><h2>Adapter mon CV</h2>
      <p className="muted">Colle le texte de l’annonce. L’assistant ne pourra mieux présenter que des éléments déjà présents dans ton CV.</p>
      <textarea className="cv-editor offer-textarea" value={offerText} onChange={(event) => setOfferText(event.target.value)} placeholder="Colle ici l’annonce ou les missions principales…" />
      <button className="primary" onClick={() => void adaptToOffer()} disabled={working}>{working ? 'ANALYSE…' : 'ADAPTER À CETTE OFFRE'}</button>
    </Card>

    {suggestions.map((suggestion) => <Card key={`${suggestion.sectionId}-${suggestion.after}`} className="suggestion-card"><p className="eyebrow">PROPOSITION</p><div className="before-after"><div><small>Avant</small><p>{sections.find((section) => section.id === suggestion.sectionId)?.content}</p></div><div><small>Après</small><p>{suggestion.after}</p></div></div>{suggestion.reason && <p className="muted">{suggestion.reason}</p>}<div className="decision-actions"><button className="primary" onClick={() => accept(suggestion)}>ACCEPTER</button><button className="secondary" onClick={() => setSuggestions((current) => current.filter((item) => item !== suggestion))}>REFUSER</button></div></Card>)}
    {rawSuggestion && <Card><p className="eyebrow">PROPOSITION IA</p><p className="pre-line">{rawSuggestion}</p></Card>}
    {message && <p className="notice">{message}</p>}

    <Card><p className="eyebrow">EXPORT</p><h2>Télécharger</h2><button className="primary" onClick={exportPDF}>EXPORTER EN PDF</button>{meta && <button className="secondary full" onClick={() => void downloadOriginal()}>TÉLÉCHARGER L’ORIGINAL</button>}</Card>
  </section>;
}

function parseSuggestions(text: string): ParsedSuggestion[] {
  try {
    const cleaned = text.replace(/^```json\s*/i,'').replace(/```$/,'').trim();
    const parsed = JSON.parse(cleaned) as { suggestions?:ParsedSuggestion[] } | ParsedSuggestion[];
    return Array.isArray(parsed) ? parsed : parsed.suggestions ?? [];
  } catch { return []; }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[character] ?? character));
}
