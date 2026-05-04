/* ─────────────────────────────────────────
   ENOMAD KOREA — Main JavaScript
   ───────────────────────────────────────── */

'use strict';

/* ── 1. Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
});

/* ── 2. Hamburger Menu ── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── 3. Scroll Top ── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 4. Hero Particles ── */
(function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('div');
    dot.classList.add('particle');
    const size = Math.random() * 6 + 3;
    dot.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(dot);
  }
})();

/* ── 5. Fade-up on scroll ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.service-card, .why-card, .ps, .section-title, .section-desc, .section-label'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

/* ── 6. Service card CTA → auto-set form type ── */
document.querySelectorAll('.sc-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const type = btn.dataset.type;
    if (!type) return;

    // 항공/해상 탭 자동 선택
    if (type === '해상 콘솔' || type === '항공 콘솔') {
      document.querySelectorAll('.atab').forEach(t => {
        t.classList.toggle('active', t.dataset.type === type);
      });
      document.getElementById('serviceType').value = type;
    }
  });
});

/* ── 7. Apply Tabs ── */
document.querySelectorAll('.atab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('serviceType').value = tab.dataset.type;
  });
});

/* ── 8. Form Validation ── */
function validateForm() {
  const fields = [
    { id: 'companyName',   label: '업체명' },
    { id: 'contactName',   label: '담당자명' },
    { id: 'contactPhone',  label: '연락처' },
    { id: 'contactEmail',  label: '이메일' },
  ];

  let valid = true;

  fields.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    el.classList.remove('error');
    if (!el.value.trim()) {
      el.classList.add('error');
      el.placeholder = `⚠ ${label}을(를) 입력해 주세요`;
      valid = false;
    }
  });

  // Email format check
  const emailEl = document.getElementById('contactEmail');
  if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error');
    valid = false;
  }

  // Privacy check
  if (!document.getElementById('privacyCheck').checked) {
    alert('개인정보 수집 및 이용에 동의해 주세요.');
    valid = false;
  }

  return valid;
}

/* ── 9. Form Submit → Table API ── */
const applyForm   = document.getElementById('applyForm');
const applySuccess = document.getElementById('applySuccess');
const submitBtn   = document.getElementById('submitBtn');

applyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신청 중...';

  const payload = {
    service_type:         document.getElementById('serviceType').value,
    company_name:         document.getElementById('companyName').value.trim(),
    contact_name:         document.getElementById('contactName').value.trim(),
    contact_phone:        document.getElementById('contactPhone').value.trim(),
    contact_email:        document.getElementById('contactEmail').value.trim(),
    origin_country:       document.getElementById('originCountry').value,
    destination_country:  document.getElementById('destinationCountry').value,
    cargo_type:           document.getElementById('cargoType').value,
    cargo_weight:         document.getElementById('cargoWeight').value.trim(),
    fba_needed:           document.getElementById('fbaNeeded').checked,
    message:              document.getElementById('message').value.trim(),
    status:               '접수완료',
  };

  try {
    const res = await fetch('tables/console_requests', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('서버 오류');

    // 성공 처리
    applyForm.style.display = 'none';
    document.querySelector('.apply-tabs').style.display = 'none';
    applySuccess.style.display = 'block';

    // 성공 후 스크롤
    applySuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

  } catch (err) {
    console.error(err);
    alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 무료 견적 신청하기';
  }
});

/* ── 10. Reset Form ── */
document.getElementById('resetBtn').addEventListener('click', () => {
  applyForm.reset();
  applyForm.style.display = 'flex';
  document.querySelector('.apply-tabs').style.display = 'flex';
  applySuccess.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 무료 견적 신청하기';

  // 탭 초기화
  document.querySelectorAll('.atab').forEach((t, i) => t.classList.toggle('active', i === 0));
  document.getElementById('serviceType').value = '해상 콘솔';
});

/* ── 11. Smooth Anchor Scroll (offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 12. Phone input formatting ── */
document.getElementById('contactPhone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  if (v.length <= 3) {
    this.value = v;
  } else if (v.length <= 7) {
    this.value = v.slice(0, 3) + '-' + v.slice(3);
  } else {
    this.value = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7, 11);
  }
});

/* ══════════════════════════════════════
   LOGISTICS TOOLS
══════════════════════════════════════ */

// ── 툴 탭 전환 ──
document.querySelectorAll('.tool-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tool-' + btn.dataset.tool).classList.add('active');
  });
});

// ── 서비스 탭 ──
document.querySelectorAll('.tfab').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.tool-form-tabs').querySelectorAll('.tfab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('q_serviceType').value = btn.dataset.svc;
  });
});

// ── 견적 폼 제출 ──
document.getElementById('quoteForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    서비스: document.getElementById('q_serviceType').value,
    업체명: document.getElementById('q_company').value,
    담당자: document.getElementById('q_name').value,
    연락처: document.getElementById('q_phone').value,
    이메일: document.getElementById('q_email').value,
    출발지: document.getElementById('q_origin').value,
    목적지: document.getElementById('q_dest').value,
    화물종류: document.getElementById('q_cargo').value,
    물량: document.getElementById('q_weight').value,
    요청사항: document.getElementById('q_msg').value,
  };
  if (!data.업체명 || !data.담당자 || !data.연락처 || !data.이메일) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }
  if (!document.getElementById('q_privacy').checked) {
    alert('개인정보 수집에 동의해주세요.');
    return;
  }
  const btn = e.target.querySelector('.tool-submit-btn');
  btn.textContent = '전송 중...'; btn.disabled = true;
  try {
    await fetch('https://formspree.io/f/xjglywvk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    document.getElementById('quoteForm').style.display = 'none';
    document.getElementById('quoteSuccess').style.display = 'block';
  } catch {
    alert('전송 중 오류가 발생했습니다. 이메일로 직접 문의해주세요.');
  } finally {
    btn.textContent = '견적 신청하기'; btn.disabled = false;
  }
});

/* ══ UPS 계산기 ══ */
const UPS_RATES = {
  commercial: {
    2: [8.19,8.19,8.19,8.19,8.19,9.07,9.26,9.39,9.39,9.39,10.23,10.35,10.54,10.54,10.70,10.70,11.84,12.07,12.07,12.18,13.65,13.65,13.87,14.05,14.51,14.51,14.51,14.79,15.02,15.02],
    3: [8.52,8.52,8.52,8.52,8.52,9.47,9.76,9.91,9.91,9.91,10.80,10.94,11.15,11.15,11.38,11.38,12.65,12.93,12.93,13.08,14.72,14.72,14.99,15.22,15.80,15.80,15.80,16.14,16.43,16.43],
    4: [8.85,8.85,8.85,8.85,8.85,9.88,10.26,10.43,10.43,10.43,11.37,11.53,11.76,11.76,12.06,12.06,13.46,13.79,13.79,13.98,15.79,15.79,16.11,16.39,17.09,17.09,17.09,17.49,17.84,17.84],
    5: [9.18,9.18,9.18,9.18,9.18,10.29,10.76,10.95,10.95,10.95,11.94,12.12,12.37,12.37,12.74,12.74,14.27,14.65,14.65,14.88,16.86,16.86,17.23,17.56,18.38,18.38,18.38,18.84,19.25,19.25],
    6: [9.75,9.75,9.75,9.75,9.75,10.93,11.55,11.79,11.79,11.79,12.85,13.07,13.37,13.37,13.80,13.80,15.55,16.01,16.01,16.31,18.45,18.45,18.90,19.31,20.31,20.31,20.31,20.90,21.42,21.42],
    7: [10.32,10.32,10.32,10.32,10.32,11.57,12.34,12.63,12.63,12.63,13.76,14.02,14.37,14.37,14.86,14.86,16.83,17.37,17.37,17.74,20.04,20.04,20.57,21.06,22.24,22.24,22.24,22.96,23.59,23.59],
    8: [10.89,10.89,10.89,10.89,10.89,12.21,13.13,13.47,13.47,13.47,14.67,14.97,15.37,15.37,15.92,15.92,18.11,18.73,18.73,19.17,21.63,21.63,22.24,22.81,24.17,24.17,24.17,25.02,25.76,25.76],
    9: [11.45,11.45,11.45,11.45,11.45,12.87,13.95,14.34,14.34,14.34,15.60,15.94,16.40,16.40,17.02,17.02,19.39,20.11,20.11,20.62,23.22,23.22,23.91,24.56,26.10,26.10,26.10,27.08,27.93,27.93],
    10: [12.02,12.02,12.02,12.02,12.02,13.53,14.77,15.21,15.21,15.21,16.53,16.91,17.43,17.43,18.12,18.12,20.67,21.49,21.49,22.07,24.81,24.81,25.58,26.31,28.03,28.03,28.03,29.14,30.10,30.10],
    11: [12.35,12.35,12.35,12.35,12.35,13.94,15.27,15.75,15.75,15.75,17.13,17.54,18.11,18.11,18.85,18.85,21.57,22.45,22.45,23.09,26.06,26.06,26.89,27.68,29.56,29.56,29.56,30.74,31.78,31.78],
    12: [12.68,12.68,12.68,12.68,12.68,14.35,15.77,16.29,16.29,16.29,17.73,18.17,18.79,18.79,19.58,19.58,22.47,23.41,23.41,24.11,27.31,27.31,28.20,29.05,31.09,31.09,31.09,32.34,33.46,33.46],
    13: [13.16,13.16,13.16,13.16,13.16,14.91,16.43,16.99,16.99,16.99,18.49,18.97,19.64,19.64,20.49,20.49,23.59,24.61,24.61,25.38,28.83,28.83,29.81,30.74,32.99,32.99,32.99,34.37,35.59,35.59],
    14: [13.64,13.64,13.64,13.64,13.64,15.47,17.09,17.69,17.69,17.69,19.25,19.77,20.49,20.49,21.40,21.40,24.71,25.81,25.81,26.65,30.35,30.35,31.42,32.43,34.89,34.89,34.89,36.40,37.72,37.72],
    15: [14.12,14.12,14.12,14.12,14.12,16.03,17.75,18.39,18.39,18.39,20.01,20.57,21.34,21.34,22.31,22.31,25.83,27.01,27.01,27.92,31.87,31.87,33.03,34.12,36.79,36.79,36.79,38.43,39.85,39.85],
  },
  residential: {
    2: [11.89,11.89,11.89,11.89,11.89,12.77,12.96,13.09,13.09,13.09,13.93,14.05,14.24,14.24,14.40,14.40,15.54,15.77,15.77,15.88,17.35,17.35,17.57,17.75,18.21,18.21,18.21,18.49,18.72,18.72],
    3: [12.32,12.32,12.32,12.32,12.32,13.27,13.56,13.71,13.71,13.71,14.60,14.74,14.95,14.95,15.18,15.18,16.45,16.73,16.73,16.88,18.52,18.52,18.79,19.02,19.60,19.60,19.60,19.94,20.23,20.23],
    5: [13.18,13.18,13.18,13.18,13.18,14.29,14.76,14.95,14.95,14.95,15.94,16.12,16.37,16.37,16.74,16.74,18.27,18.65,18.65,18.88,20.86,20.86,21.23,21.56,22.38,22.38,22.38,22.84,23.25,23.25],
    10: [16.02,16.02,16.02,16.02,16.02,17.53,18.77,19.21,19.21,19.21,20.53,20.91,21.43,21.43,22.12,22.12,24.67,25.49,25.49,26.07,28.81,28.81,29.58,30.31,32.03,32.03,32.03,33.14,34.10,34.10],
    15: [18.12,18.12,18.12,18.12,18.12,20.03,21.75,22.39,22.39,22.39,24.01,24.57,25.34,25.34,26.31,26.31,29.83,31.01,31.01,31.92,35.87,35.87,37.03,38.12,40.79,40.79,40.79,42.43,43.85,43.85],
  }
};

function getZone(zip3) {
  const z = parseInt(zip3);
  if (z >= 0   && z <= 199) return 8;
  if (z >= 200 && z <= 212) return 8;
  if (z >= 214 && z <= 219) return 8;
  if (z >= 220 && z <= 246) return 8;
  if (z >= 247 && z <= 268) return 7;
  if (z >= 270 && z <= 289) return 7;
  if (z >= 290 && z <= 299) return 7;
  if (z >= 300 && z <= 319) return 7;
  if (z >= 320 && z <= 339) return 7;
  if (z >= 340 && z <= 349) return 6;
  if (z >= 350 && z <= 369) return 6;
  if (z >= 370 && z <= 385) return 6;
  if (z >= 386 && z <= 397) return 6;
  if (z >= 398 && z <= 399) return 6;
  if (z >= 400 && z <= 418) return 5;
  if (z >= 419 && z <= 427) return 5;
  if (z >= 430 && z <= 459) return 5;
  if (z >= 460 && z <= 479) return 5;
  if (z >= 480 && z <= 499) return 5;
  if (z >= 500 && z <= 516) return 4;
  if (z >= 520 && z <= 528) return 4;
  if (z >= 530 && z <= 549) return 4;
  if (z >= 550 && z <= 567) return 4;
  if (z >= 570 && z <= 588) return 4;
  if (z >= 590 && z <= 599) return 4;
  if (z >= 600 && z <= 620) return 3;
  if (z >= 622 && z <= 631) return 3;
  if (z >= 633 && z <= 658) return 3;
  if (z >= 660 && z <= 679) return 3;
  if (z >= 680 && z <= 693) return 3;
  if (z >= 700 && z <= 714) return 4;
  if (z >= 716 && z <= 729) return 5;
  if (z >= 730 && z <= 749) return 5;
  if (z >= 750 && z <= 799) return 5;
  if (z >= 800 && z <= 816) return 3;
  if (z >= 820 && z <= 831) return 3;
  if (z >= 832 && z <= 838) return 3;
  if (z >= 840 && z <= 847) return 3;
  if (z >= 850 && z <= 853) return 2;
  if (z >= 855 && z <= 857) return 2;
  if (z >= 859 && z <= 860) return 2;
  if (z >= 863 && z <= 865) return 2;
  if (z >= 870 && z <= 884) return 3;
  if (z >= 885 && z <= 885) return 3;
  if (z >= 889 && z <= 898) return 2;
  if (z >= 900 && z <= 908) return 2;
  if (z >= 910 && z <= 928) return 2;
  if (z >= 930 && z <= 961) return 2;
  if (z >= 967 && z <= 968) return 8;
  if (z >= 969 && z <= 969) return 8;
  if (z >= 970 && z <= 979) return 3;
  if (z >= 980 && z <= 994) return 3;
  if (z >= 995 && z <= 999) return 8;
  return 5;
}

function getRateForWeight(table, weight) {
  const keys = Object.keys(table).map(Number).sort((a,b)=>a-b);
  let chosen = keys[keys.length-1];
  for (const k of keys) { if (weight <= k) { chosen = k; break; } }
  return table[chosen];
}

function upsLookupAddress() {
  const val = document.getElementById('ups_address').value.trim();
  const res = document.getElementById('ups_addr_result');
  if (!val) return;
  const zipMatch = val.match(/\b(\d{5})\b/);
  if (zipMatch) {
    res.textContent = `✅ ZIP: ${zipMatch[1]} 확인됨`;
    return;
  }
  if (typeof google === 'undefined') {
    res.textContent = '주소 조회를 사용하려면 잠시 후 다시 시도해주세요.';
    return;
  }
  res.textContent = '주소 조회 중...';
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: val + ', USA' }, (results, status) => {
    if (status === 'OK') {
      const comp = results[0].address_components.find(c => c.types.includes('postal_code'));
      if (comp) {
        document.getElementById('ups_address').value = comp.long_name;
        res.textContent = `✅ ZIP: ${comp.long_name} (${results[0].formatted_address})`;
      } else {
        res.textContent = '⚠️ ZIP 코드를 찾을 수 없습니다. 직접 입력해주세요.';
      }
    } else {
      res.textContent = '⚠️ 주소를 찾을 수 없습니다. ZIP 코드를 직접 입력해주세요.';
    }
  });
}

function calcUPS() {
  const addrVal = document.getElementById('ups_address').value.trim();
  const zipMatch = addrVal.match(/\b(\d{5})\b/) || addrVal.match(/^(\d{5})$/);
  if (!zipMatch) { alert('ZIP 코드를 입력하거나 주소를 먼저 조회해주세요.'); return; }
  const zip5 = zipMatch[1];
  const zip3 = parseInt(zip5.substring(0,3));
  const zone = getZone(zip3);
  const type = document.getElementById('ups_type').value;
  const weight = parseFloat(document.getElementById('ups_weight').value) || 1;
  const qty = parseInt(document.getElementById('ups_qty').value) || 1;
  const table = UPS_RATES[type];
  if (!table) return;
  const rates = getRateForWeight(table, weight);
  const unitRate = rates[zone - 1] || rates[4];
  const total = (unitRate * qty).toFixed(2);
  const resultEl = document.getElementById('ups_result');
  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <h4><i class="fas fa-truck"></i> 운임 계산 결과</h4>
    <div class="ups-rate-row"><span class="ups-rate-label">목적지 ZIP</span><span>${zip5}</span></div>
    <div class="ups-rate-row"><span class="ups-rate-label">Zone</span><span>${zone}</span></div>
    <div class="ups-rate-row"><span class="ups-rate-label">배송 유형</span><span>${type === 'commercial' ? 'Commercial' : 'Residential'}</span></div>
    <div class="ups-rate-row"><span class="ups-rate-label">무게</span><span>${weight} lbs</span></div>
    <div class="ups-rate-row"><span class="ups-rate-label">수량</span><span>${qty} 박스</span></div>
    <div class="ups-rate-row"><span class="ups-rate-label">박스당 운임</span><span>$${unitRate.toFixed(2)}</span></div>
    <div class="ups-rate-row ups-rate-total"><span class="ups-rate-label"><strong>총 예상 운임</strong></span><span class="ups-rate-value">$${total}</span></div>
    <p style="font-size:11px;color:#94a3b8;margin-top:10px;">※ 실제 운임은 치수 무게·연료할증료 등에 따라 달라질 수 있습니다.</p>
  `;
}

/* ══ HS Code 조회 ══ */
const HS_KEYWORDS = {
  '6109.10.00': ['면 티셔츠','cotton t-shirt','티셔츠','t-shirt','면티'],
  '6110.20.20': ['면 스웨터','cotton sweater','스웨터','니트'],
  '6204.62.40': ['면 바지','cotton pants','청바지','jeans','데님'],
  '3304.99.50': ['화장품','크림','로션','스킨케어','serum','세럼','cosmetic','cream','lotion'],
  '3305.10.00': ['샴푸','shampoo','헤어','hair shampoo'],
  '2106.90.99': ['식품','food supplement','건강기능식품','영양제'],
  '8517.12.00': ['스마트폰','smartphone','휴대폰','mobile phone'],
  '8471.30.01': ['노트북','laptop','notebook computer'],
  '9503.00.00': ['장난감','toy','인형','doll'],
  '4202.12.20': ['가방','bag','핸드백','handbag','백팩','backpack'],
};

function hsSearch() {
  const product = document.getElementById('hs_product').value.trim().toLowerCase();
  const resultEl = document.getElementById('hs_result');
  if (!product) { alert('제품명을 입력해주세요.'); return; }
  resultEl.style.display = 'block';
  resultEl.innerHTML = '<div class="hs-loading"><i class="fas fa-spinner fa-spin"></i> USITC DB 조회 중...</div>';

  let matchedCode = null;
  for (const [code, keywords] of Object.entries(HS_KEYWORDS)) {
    if (keywords.some(kw => product.includes(kw.toLowerCase()))) {
      matchedCode = code; break;
    }
  }

  const proxyUrl = 'https://proud-river-50f1.pctspark.workers.dev/proxy';
  const searchTerm = matchedCode || product;

  fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'search', query: searchTerm })
  })
  .then(r => r.json())
  .then(data => {
    const code = data.hts8 || matchedCode || '확인 필요';
    const mfn = data.mfnRate || (matchedCode === '6109.10.00' ? '16.5%' : '조회 중');
    const fta = data.ftaRate || '0% (한-미 FTA)';
    const sec301 = data.section301 || '해당없음';
    showHSResult(code, mfn, fta, sec301, product);
  })
  .catch(() => {
    const code = matchedCode || '직접 확인 필요';
    showHSResult(code, '–', '–', '–', product);
  });
}

function showHSResult(code, mfn, fta, sec301, product) {
  const resultEl = document.getElementById('hs_result');
  const isFda = ['화장품','크림','로션','식품','샴푸'].some(k => product.includes(k));
  resultEl.innerHTML = `
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;color:#64748b;margin-bottom:6px;">AI 추정 HS Code</div>
      <span class="hs-code-badge">${code}</span>
    </div>
    <div class="hs-rate-grid">
      <div class="hs-rate-card">
        <div class="label">MFN 관세율</div>
        <div class="value">${mfn}</div>
      </div>
      <div class="hs-rate-card fta">
        <div class="label">한-미 FTA</div>
        <div class="value">${fta}</div>
      </div>
      <div class="hs-rate-card ${sec301 !== '해당없음' ? 'warning' : ''}">
        <div class="label">Section 301</div>
        <div class="value">${sec301}</div>
      </div>
    </div>
    <div class="hs-checklist">
      <h5>📋 통관 체크리스트</h5>
      <div class="hs-check-item"><span class="dot dot-ok"></span> Commercial Invoice (CI) 준비</div>
      <div class="hs-check-item"><span class="dot dot-ok"></span> Packing List (PL) 준비</div>
      ${isFda ? '<div class="hs-check-item"><span class="dot dot-warn"></span> FDA 사전 신고 필요 (Prior Notice)</div>' : ''}
      <div class="hs-check-item"><span class="dot dot-ok"></span> 원산지증명서 (C/O) — FTA 적용 시 필수</div>
      <div class="hs-check-item"><span class="dot dot-warn"></span> 정확한 HS Code는 관세사 최종 확인 권장</div>
    </div>
    <p style="font-size:11px;color:#94a3b8;margin-top:12px;">※ AI 추정 결과입니다. 실제 통관 시 공인 관세사 확인을 권장합니다.</p>
  `;
}
