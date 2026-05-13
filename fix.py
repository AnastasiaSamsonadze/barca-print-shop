import re

f = open(r'd:\barcaprintshop\index.html', 'rb')
data = f.read()
f.close()

# Determine the bad char (U+FFFD = ef bf bd)
FFFD = '\ufffd'

c = data.decode('utf-8', errors='replace')

# ── Fix all known broken Spanish words (where ? = U+FFFD) ──────────────────
replacements = [
    # Google Reviews
    (FFFD+'Calidad incre'+FFFD+'ble!', '¡Calidad increíble!'),
    ('Ped'+FFFD+' camisetas personalizadas para todo mi grupo y todos se volvieron locos. La impresi'+FFFD+'n es n'+FFFD+'tida, los colores son vivos y lleg'+FFFD+' mucho m'+FFFD+'s r'+FFFD+'pido de lo esperado.',
     'Pedí camisetas personalizadas para todo mi grupo y todos se volvieron locos. La impresión es nítida, los colores son vivos y llegó mucho más rápido de lo esperado.'),
    ('Ped'+FFFD+' 20 camisetas personalizadas para la fiesta de la empresa. El equipo fue muy atento y la calidad super'+FFFD+' con creces lo que pagamos. Volver'+FFFD+' a pedir.',
     'Pedí 20 camisetas personalizadas para la fiesta de la empresa. El equipo fue muy atento y la calidad superó con creces lo que pagamos. Volveré a pedir.'),
    ('tu visi'+FFFD+'n.', 'tu visión.'),
    ('hace 2 d'+FFFD+'as', 'hace 2 días'),
    ('hace 4 d'+FFFD+'as', 'hace 4 días'),
    # Rating line
    ('248 rese'+FFFD+'+as de Google', '248 reseñas de Google'),
    ('rese'+FFFD+'+as de 4', 'reseñas de 4'),
    # About section
    ('art'+FFFD+'culo', 'artículo'),
    ('gr'+FFFD+'ficos', 'gráficos'),
    ('Merch f'+FFFD+'cil', 'Merch fácil'),
    # CTA
    (FFFD+'Listo para Crear Algo Incre'+FFFD+'ble?', '¡Listo para Crear Algo Increíble?'),
    ('impresi'+FFFD+'n personalizada', 'impresión personalizada'),
    ('Impresi'+FFFD+'n personalizada', 'Impresión personalizada'),
    # Footer
    ('R'+FFFD+'pidos', 'Rápidos'),
    ('S'+FFFD+'guenos', 'Síguenos'),
    # Trust section
    ('Entrega R'+FFFD+'pida', 'Entrega Rápida'),
    ('Entrega r'+FFFD+'pida', 'Entrega rápida'),
    ('dise'+FFFD+'+o', 'diseño'),
    ('Tu dise'+FFFD+'o', 'Tu diseño'),
]

for old, new in replacements:
    if old in c:
        print(f'Replacing: {repr(old[:40])} -> {repr(new[:40])}')
        c = c.replace(old, new)
    else:
        print(f'NOT FOUND: {repr(old[:40])}')

# ── Fix the mid-page script block (it's a duplicate placed between video section and grev section) ──
# Find the misplaced script that starts right after </section> for video teaser
mid_script_start = '\n        <script>\n            // \u2500\u2500 Language Toggle'
mid_script_end = '        </script>\n                                <span class="grev-badge">'

if mid_script_start in c:
    print('\nFound misplaced mid-page script - removing it')
    # Find what comes before the script (video section end)
    idx_start = c.index(mid_script_start)
    idx_end = c.index(mid_script_end) + len(mid_script_end)
    # The content after the </script> starts with grev-badge span, which belongs to the grev section
    # We need to: remove the script block, keep the grev-badge span
    after_script_content = '                                <span class="grev-badge">'
    c = c[:idx_start] + '\n\n    <!-- ===== GOOGLE REVIEWS ===== -->\n    <section class="grev-section">\n        <div class="grev-container">\n            <h2 class="grev-heading" data-en="Lo que dicen nuestros clientes" data-ge="\u10e0\u10d0\u10e1 \u10d0\u10db\u10d1\u10dd\u10d1\u10d4\u10dc \u10e9\u10d5\u10d4\u10dc\u10d8 \u10db\u10dd\u10db\u10ee\u10db\u10d0\u10e0\u10d4\u10d1\u10da\u10d4\u10d1\u10d8">Lo que dicen nuestros clientes</h2>\n\n            <div class="grev-carousel-wrap">\n                <!-- Prev -->\n                <button class="grev-nav grev-prev" aria-label="Previous">\n                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none"><path d="M8 1L1 8l7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>\n                </button>\n\n                <div class="grev-overflow">\n                    <div class="grev-track" id="grev-track">\n\n                        <!-- Review 1 -->\n                        <article class="grev-card">\n                            <div class="grev-card-top">\n                                <div class="grev-stars" aria-label="5 out of 5 stars">\n                                    <svg viewBox="0 0 20 20"><use href="#star-filled"/></svg><svg viewBox="0 0 20 20"><use href="#star-filled"/></svg><svg viewBox="0 0 20 20"><use href="#star-filled"/></svg><svg viewBox="0 0 20 20"><use href="#star-filled"/></svg><svg viewBox="0 0 20 20"><use href="#star-filled"/></svg>\n                                </div>\n                                ' + c[idx_end:]
    print('Removed misplaced script and prepended grev-section opening')
else:
    print('Mid-page script NOT found by marker - trying alternate detection')
    # Count the number of <script> tags
    script_count = c.count('<script>')
    print(f'Script count: {script_count}')

# Check for any remaining FFFD chars
remaining = c.count(FFFD)
print(f'\nRemaining FFFD chars: {remaining}')
if remaining > 0:
    # find all
    for i, m in enumerate(re.finditer(re.escape(FFFD), c)):
        ctx = c[max(0,m.start()-20):m.end()+20]
        print(f'  [{i}] ...{repr(ctx)}...')
        if i > 20:
            print('  (more...)')
            break

out = c.encode('utf-8')
open(r'd:\barcaprintshop\index.html', 'wb').write(out)
print('\nFile written.')
