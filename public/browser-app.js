

let token = '';

// Show login form
function showLoginForm() {
  document.body.innerHTML = `
    <div class="container">
      <h2>Login</h2>
      <form class="login-form">
        <input type="email" class="email-input" placeholder="Email" required />
        <input type="password" class="password-input" placeholder="Password" required />
        <button type="submit" class="btn">Login</button>
        <div class="form-alert"></div>
      </form>
      <button class="btn" id="to-register">Go to Register</button>
    </div>
  `;
  const loginForm = document.querySelector('.login-form');
  const emailInput = document.querySelector('.email-input');
  const passwordInput = document.querySelector('.password-input');
  const formAlert = document.querySelector('.form-alert');
  document.getElementById('to-register').onclick = showRegisterForm;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    formAlert.style.display = 'none';
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/login', { email, password });
      token = res.data.token;
      showMainApp();
    } catch (error) {
      formAlert.style.display = 'block';
      formAlert.textContent = error.response?.data?.msg || 'Error, please try again';
    }
  });
}

// Show register form
function showRegisterForm() {
  document.body.innerHTML = `
    <div class="container">
      <h2>Register</h2>
      <form class="register-form">
        <input type="text" class="name-input" placeholder="Name" required />
        <input type="email" class="email-input" placeholder="Email" required />
        <input type="password" class="password-input" placeholder="Password" required />
        <button type="submit" class="btn">Register</button>
        <div class="form-alert"></div>
      </form>
      <button class="btn" id="to-login">Go to Login</button>
    </div>
  `;
  const registerForm = document.querySelector('.register-form');
  const nameInput = document.querySelector('.name-input');
  const emailInput = document.querySelector('.email-input');
  const passwordInput = document.querySelector('.password-input');
  const formAlert = document.querySelector('.form-alert');
  document.getElementById('to-login').onclick = showLoginForm;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    formAlert.style.display = 'none';
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/register', { name, email, password });
      token = res.data.token;
      showMainApp();
    } catch (error) {
      formAlert.style.display = 'block';
      formAlert.textContent = error.response?.data?.msg || 'Error, please try again';
    }
  });
}

// Show main job manager app
function showMainApp() {
  document.body.innerHTML = `
    <div class="container">
      <h2>Job Manager</h2>
      <form class="job-form">
        <input type="text" class="job-input" placeholder="Job Position" required />
        <input type="text" class="company-input" placeholder="Company" required />
        <button type="submit" class="btn">Add Job</button>
        <div class="form-alert"></div>
      </form>
      <div class="loading-text">Loading...</div>
      <div class="jobs"></div>
      <button class="btn logout-btn" style="margin-top:16px;">Logout</button>
    </div>
  `;
  // Re-select DOM elements
  jobsDOM = document.querySelector('.jobs');
  loadingDOM = document.querySelector('.loading-text');
  formDOM = document.querySelector('.job-form');
  jobInputDOM = document.querySelector('.job-input');
  companyInputDOM = document.querySelector('.company-input');
  formAlertDOM = document.querySelector('.form-alert');
  const logoutBtn = document.querySelector('.logout-btn');

  logoutBtn.addEventListener('click', () => {
    token = '';
    showAuthForm();
  });

  showJobs();

  jobsDOM.addEventListener('click', async (e) => {
    let button = e.target;
    if (button.classList.contains('delete-btn')) {
      loadingDOM.style.visibility = 'visible';
      const id = button.dataset.id;
      try {
        await axios.delete(`http://localhost:3000/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showJobs();
      } catch (error) {
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'Error deleting job';
      }
      loadingDOM.style.visibility = 'hidden';
    } else if (button.classList.contains('edit-btn')) {
      const id = button.dataset.id;
      const job = button.closest('.single-job');
      const position = job.querySelector('.job-position').textContent;
      const company = job.querySelector('.company').textContent.replace('@','');
      jobInputDOM.value = position;
      companyInputDOM.value = company;
      formDOM.setAttribute('data-edit-id', id);
      formAlertDOM.textContent = 'Edit mode: change values and submit.';
      formAlertDOM.style.display = 'block';
      formAlertDOM.classList.add('text-success');
    }
  });

  formDOM.addEventListener('submit', async (e) => {
    e.preventDefault();
    const position = jobInputDOM.value;
    const company = companyInputDOM.value;
    const editId = formDOM.getAttribute('data-edit-id');
    try {
      if (editId) {
        await axios.patch(`http://localhost:3000/api/v1/jobs/${editId}`, { position, company }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        formDOM.removeAttribute('data-edit-id');
        formAlertDOM.textContent = 'Job updated!';
      } else {
        await axios.post('http://localhost:3000/api/v1/jobs', { position, company }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        formAlertDOM.textContent = 'Job added!';
      }
      showJobs();
      jobInputDOM.value = '';
      companyInputDOM.value = '';
      formAlertDOM.style.display = 'block';
      formAlertDOM.classList.add('text-success');
    } catch (error) {
      formAlertDOM.style.display = 'block';
      formAlertDOM.textContent = error.response?.data?.msg || 'Error, please try again';
    }
    setTimeout(() => {
      formAlertDOM.style.display = 'none';
      formAlertDOM.classList.remove('text-success');
    }, 3000);
  });
}

async function showJobs() {
  loadingDOM.style.visibility = 'visible';
  try {
    const { data } = await axios.get('http://localhost:3000/api/v1/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const jobs = data.jobs || data; // support both array and {jobs:[]} formats
    if (!jobs || jobs.length < 1) {
      jobsDOM.innerHTML = '<h5 class="empty-list">No jobs found</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }
    const allJobs = jobs.map(job => {
      const { _id, position, company } = job;
      return `<div class="single-job">
        <h5><span class="job-position">${position}</span> <span class="company">@${company}</span></h5>
        <div class="job-links">
          <button type="button" class="edit-btn" data-id="${_id}">Edit</button>
          <button type="button" class="delete-btn" data-id="${_id}">Delete</button>
        </div>
      </div>`;
    }).join('');
    jobsDOM.innerHTML = allJobs;
  } catch (error) {
    jobsDOM.innerHTML = '<h5 class="empty-list">Error loading jobs</h5>';
  }
  loadingDOM.style.visibility = 'hidden';
}

// Start with login form
showLoginForm();
