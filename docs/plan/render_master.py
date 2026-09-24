# Renders MASTER-PLAN.md to MASTER-PLAN.html (then Chromium prints the PDF).
import markdown, re
md = open("MASTER-PLAN.md", encoding="utf-8").read()
body_md = md.split("\n---\n", 1)[1]  # drop the title block; the cover replaces it
html = markdown.markdown(body_md, extensions=["tables", "fenced_code", "sane_lists"])

light = [("canvas","#F7F9F6"),("surface","#FFFFFF"),("wash","#EDF3EE"),("line","#D5DED7"),("line-strong","#7E8F84"),
         ("ink","#0B1A13"),("ink-2","#34443B"),("ink-3","#56665C"),("neem","#0B6B45"),("neem-strong","#08543A"),("neem-wash","#E3F2E8"),
         ("haldi","#8A5A00"),("haldi-wash","#FDF3DC"),("kumkum","#B3261E"),("kumkum-wash","#FCE8E6"),("indigo","#2F4BC8"),("indigo-wash","#E8ECFB")]
def sw(n,h):
    dark = n in ("ink","ink-2","ink-3","neem","neem-strong","haldi","kumkum","indigo","line-strong")
    return f'<div class="sw"><div class="chip" style="background:{h}"></div><b>{n}</b><span>{h}</span></div>'
swatches = '<div class="swatches">' + "".join(sw(n,h) for n,h in light) + '</div>'
demo = '''<div class="demo">
 <div class="demo-hd"><span class="seal">§</span><b>IP-SAKTI Sahayak</b><span class="nav">Home&nbsp;&nbsp;<u>Case</u>&nbsp;&nbsp;Library&nbsp;&nbsp;How it works</span><span class="btn">Start a case</span></div>
 <div class="demo-bd">
  <div class="band"><span class="seal big">2</span><div><div class="h1">Classify</div><div class="lede">What your product is in law decides every other answer.</div></div><span class="st risk">Risk found</span></div>
  <div class="finding"><div class="h3">Patent or proprietary Ayurvedic medicine</div>
   <div class="row"><span class="mk v">✓</span>A combination of known ingredients is not an invention unless it shows synergy. <span class="cite">§ PA 3(e)</span></div>
   <div class="row chg"><span class="mk u">○</span>Wild-collected roots need prior intimation to the State Biodiversity Board. <span class="cite">§ BDA 7</span> <span class="st input">Changed</span></div>
   <div class="row"><span class="mk c">⇄</span>Commentators disagree on NBA registration for cultivated plants. <span class="cite">§ BDA 6</span></div>
  </div>
 </div></div>'''
html = html.replace("<p><strong>Light (primary theme)</strong></p>", '<p class="cap">Palette and a sample of the light theme in use (for reference; the tokens below are the source of truth).</p>' + swatches + demo + "<p><strong>Light (primary theme)</strong></p>", 1)
html = html.replace('<h2>Part', '<h2 class="part">Part')
html = re.sub(r'<h2>(Appendix)', r'<h2 class="part">\1', html)

css = open("master.css", encoding="utf-8").read()
cover = '''<div class="cover"><div class="in">
<div class="kick">SIH PS 26045 · Ministry of Ayush × AIIA</div>
<h1>IP-SAKTI Sahayak<span>Master Plan v8</span></h1>
<p class="sub">UI overhaul and implementation spec. Board review of the live site, a light-first design system, and a task-by-task build plan an executing model can follow.</p>
<div class="pal">''' + "".join(f'<i style="background:{h}"></i>' for n,h in light if n in ("canvas","wash","neem-wash","neem","neem-strong","ink","haldi","kumkum","indigo")) + '''</div>
</div><div class="meta"><div><b>Date</b>24 Sep 2026</div><div><b>Base</b>61921a8</div><div><b>Theme</b>Light first ("The Clean Record")</div><div><b>For</b>Team + executing model</div></div></div>'''
out = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>IP-SAKTI Master Plan v8</title><link rel="stylesheet" href="fonts.css"><style>{css}</style></head><body>{cover}<main>{html}</main></body></html>'
open("MASTER-PLAN.html", "w", encoding="utf-8").write(out)
print("ok", len(out))
