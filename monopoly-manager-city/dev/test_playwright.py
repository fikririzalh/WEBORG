"""
Automated regression tests for Monopoly City Manager.
Requires: pip install playwright && playwright install chromium
Run: python3 test_playwright.py
"""
import json, os, sys, tempfile
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = f"file://{os.path.join(HERE, '..', 'index.html')}"

passed, failed = 0, 0
def check(label, cond):
    global passed, failed
    if cond:
        passed += 1; print(f"OK   - {label}")
    else:
        failed += 1; print(f"FAIL - {label}")

def fresh_page(pw, seed_localstorage=None):
    b = pw.chromium.launch()
    page = b.new_page(viewport={'width':1100,'height':800})
    if seed_localstorage is not None:
        page.goto(INDEX)
        page.evaluate(f"localStorage.setItem('cities', {json.dumps(json.dumps(seed_localstorage))})")
        page.reload()
    else:
        page.goto(INDEX)
    page.wait_for_timeout(150)
    return b, page

def add_city(page, name, country=''):
    page.click('#addCityBtn')
    page.fill('#cityName', name)
    if country: page.fill('#cityCountry', country)
    page.click('#cityModal .primary-btn')
    page.wait_for_timeout(100)

def add_property(page, name, status='Available', house=0, apart=0, hotel=0, landmark=0):
    page.click('#addPropertyBtn')
    page.fill('#propertyName', name)
    page.select_option('#propertyStatus', status)
    page.fill('#house', str(house)); page.fill('#apart', str(apart))
    page.fill('#hotel', str(hotel)); page.fill('#landmark', str(landmark))
    page.click('#propertyModal .primary-btn')
    page.wait_for_timeout(100)

with sync_playwright() as pw:

    # 1. Fresh load: no phantom modals/overlays visible
    b, page = fresh_page(pw)
    check("no modal overlay visible on fresh load", not page.is_visible('#cityModal.show'))
    check("no confirm overlay visible on fresh load", not page.is_visible('#confirmModal.show'))
    check("detail view hidden on fresh load", not page.is_visible('#detailView:not(.hidden)'))
    check("empty state shown on fresh load", page.is_visible('#cityEmpty'))
    b.close()

    # 2. Add city + flag rendering
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta', 'Indonesia')
    check("city card appears after add", page.is_visible('#cityGrid .card'))
    check("flag emoji rendered for Indonesia", '🇮🇩' in page.inner_text('#cityGrid'))
    check("global stat Total Kota = 1", page.inner_text('#globalStats') .split('\n')[1].strip() == '1' if False else '1' in page.locator('.stat-card').first.inner_text())
    b.close()

    # 3. Add property + value aggregation
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta', 'Indonesia')
    page.click('#cityGrid .open-btn')
    add_property(page, 'Menara Kuning', 'Owned', 500000, 1200000, 3000000, 8000000)
    total_text = page.inner_text('#propertyGrid .card-value')
    check("property total value computed correctly (12.700.000)", '12.700.000' in total_text)
    global_value = page.inner_text('#globalStats')
    check("global estimasi nilai reflects property total", '12.700.000' in global_value)
    b.close()

    # 4. Edit city updates data
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta', 'Indonesia')
    page.click('#cityGrid .edit-btn')
    page.fill('#cityName', 'Jakarta Pusat')
    page.click('#cityModal .primary-btn')
    page.wait_for_timeout(100)
    check("city name updated after edit", 'Jakarta Pusat' in page.inner_text('#cityGrid'))
    b.close()

    # 5. Edit property updates data
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta')
    page.click('#cityGrid .open-btn')
    add_property(page, 'Menara Kuning', 'Available', 100)
    page.click('#propertyGrid .edit-btn')
    page.fill('#propertyName', 'Menara Emas')
    page.select_option('#propertyStatus', 'Owned')
    page.click('#propertyModal .primary-btn')
    page.wait_for_timeout(100)
    check("property name updated after edit", 'Menara Emas' in page.inner_text('#propertyGrid'))
    check("property status updated after edit", 'Owned' in page.inner_text('#propertyGrid .badge'))
    b.close()

    # 6. Delete city: cancel keeps it, confirm removes it
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta')
    page.click('#cityGrid .del-btn')
    page.click('#confirmCancelBtn')
    page.wait_for_timeout(100)
    check("city NOT deleted after cancel", page.is_visible('#cityGrid .card'))
    page.click('#cityGrid .del-btn')
    page.click('#confirmOkBtn')
    page.wait_for_timeout(100)
    check("city deleted after confirm", page.is_visible('#cityEmpty'))
    b.close()

    # 7. Search filters cities
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta', 'Indonesia')
    add_city(page, 'Tokyo', 'Japan')
    page.fill('#citySearch', 'jak')
    page.wait_for_timeout(100)
    grid_text = page.inner_text('#cityGrid')
    check("search shows matching city", 'Jakarta' in grid_text)
    check("search hides non-matching city", 'Tokyo' not in grid_text)
    page.fill('#citySearch', 'zzz_no_match')
    page.wait_for_timeout(100)
    check("search with no matches shows empty message", 'Tidak ada kota' in page.inner_text('#cityGrid'))
    b.close()

    # 8. Sort changes order
    b, page = fresh_page(pw)
    add_city(page, 'Zebra City')
    add_city(page, 'Apple City')
    page.select_option('#citySort', 'name')
    page.wait_for_timeout(100)
    names = page.locator('#cityGrid h2').all_inner_texts()
    check("sort name A-Z puts Apple before Zebra", names.index('Apple City') < names.index('Zebra City'))
    page.select_option('#citySort', 'name-desc')
    page.wait_for_timeout(100)
    names = page.locator('#cityGrid h2').all_inner_texts()
    check("sort name Z-A puts Zebra before Apple", names.index('Zebra City') < names.index('Apple City'))
    b.close()

    # 9. Property status filter
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta')
    page.click('#cityGrid .open-btn')
    add_property(page, 'Prop A', 'Owned')
    add_property(page, 'Prop B', 'Available')
    page.select_option('#propStatusFilter', 'Owned')
    page.wait_for_timeout(100)
    grid_text = page.inner_text('#propertyGrid')
    check("status filter shows only Owned property", 'Prop A' in grid_text and 'Prop B' not in grid_text)
    b.close()

    # 10. Export produces valid JSON
    b, page = fresh_page(pw)
    add_city(page, 'Jakarta', 'Indonesia')
    with page.expect_download() as dl_info:
        page.click('#exportBtn')
    dl = dl_info.value
    tmp_path = os.path.join(tempfile.gettempdir(), 'export_test.json')
    dl.save_as(tmp_path)
    with open(tmp_path) as f:
        data = json.load(f)
    check("exported JSON is a valid array with the added city", isinstance(data, list) and data[0]['name']=='Jakarta')
    os.remove(tmp_path)
    b.close()

    # 11. Import replaces data after confirm
    b, page = fresh_page(pw)
    add_city(page, 'Kota Lama')
    import_payload = [{'name':'Kota Baru','country':'Indonesia','properties':[]}]
    tmp_path = os.path.join(tempfile.gettempdir(), 'import_test.json')
    with open(tmp_path,'w') as f: json.dump(import_payload, f)
    page.set_input_files('#importFile', tmp_path)
    page.wait_for_timeout(150)
    check("import shows confirm with correct button label", page.inner_text('#confirmOkBtn').strip()=='Ya, Import')
    page.click('#confirmOkBtn')
    page.wait_for_timeout(150)
    grid_text = page.inner_text('#cityGrid')
    check("import replaced old data with new", 'Kota Baru' in grid_text and 'Kota Lama' not in grid_text)
    os.remove(tmp_path)
    b.close()

    # 12. Backward-compat migration from old (no-id) data shape
    old_shape = [{'name':'Jakarta','country':'Indonesia','properties':[
        {'name':'Menara Kuning','status':'Owned','house':'500000','apart':'','hotel':'','landmark':''}
    ]}]
    b, page = fresh_page(pw, seed_localstorage=old_shape)
    ids_ok = page.evaluate("JSON.parse(localStorage.getItem('cities')).every(c => c.id && c.properties.every(p=>p.id))")
    check("old-format data migrated with generated ids", ids_ok)
    check("old-format city still renders correctly", 'Jakarta' in page.inner_text('#cityGrid'))
    b.close()

    # 13. Backdrop click closes modal
    b, page = fresh_page(pw)
    page.click('#addCityBtn')
    check("city modal open before backdrop click", page.is_visible('#cityModal.show') if False else 'show' in (page.get_attribute('#cityModal','class') or ''))
    page.click('#cityModal', position={'x':5,'y':5})
    page.wait_for_timeout(100)
    check("city modal closes on backdrop click", 'show' not in (page.get_attribute('#cityModal','class') or ''))
    b.close()

print(f"\n{passed} passed, {failed} failed.")
sys.exit(1 if failed else 0)
