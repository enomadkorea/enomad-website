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
