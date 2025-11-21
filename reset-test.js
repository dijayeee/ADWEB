const base = 'http://localhost:5000/api/users';
const username = `reset${Date.now()}`;
const email = `${username}@test.com`;

(async () => {
  const register = await fetch(base + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password: 'initial123',
      firstName: 'Reset',
      lastName: 'User'
    })
  });
  console.log('REGISTER status:', register.status);
  console.log('REGISTER body:', await register.text());

  const forgot = await fetch(base + '/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email })
  });
  console.log('FORGOT status:', forgot.status);
  console.log('FORGOT body:', await forgot.text());

  const forgotJson = await forgot.clone().json().catch(() => null);
  const resetToken = forgotJson?.resetToken;

  if (!resetToken) {
    console.error('No reset token returned');
    process.exit(1);
  }

  const reset = await fetch(base + '/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: resetToken, newPassword: 'newpass123' })
  });
  console.log('RESET status:', reset.status);
  console.log('RESET body:', await reset.text());

  const login = await fetch(base + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'newpass123' })
  });
  console.log('LOGIN status:', login.status);
  console.log('LOGIN body:', await login.text());

  process.exit(0);
})().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
const base = 'http://localhost:5000/api/users';
const username = 
eset;
const email = ${username}@test.com;
(async () => {
  const register = await fetch(base + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password: 'initial123',
      firstName: 'Reset',
      lastName: 'User'
    })
  });
  const registerBody = await register.text();
  console.log('REGISTER:', register.status, registerBody);

  const forgot = await fetch(base + '/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email })
  });
  const forgotJson = await forgot.json();
  console.log('FORGOT:', forgot.status, JSON.stringify(forgotJson));

  const reset = await fetch(base + '/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: forgotJson.resetToken, newPassword: 'newpass123' })
  });
  const resetBody = await reset.text();
  console.log('RESET:', reset.status, resetBody);

  const login = await fetch(base + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'newpass123' })
  });
  const loginBody = await login.text();
  console.log('LOGIN:', login.status, loginBody);

  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
