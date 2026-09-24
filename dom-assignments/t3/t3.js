let browser_details = [];
// Browser name and version
browser_details.push(navigator.appName + " " + navigator.appVersion);
// Operating system name
browser_details.push(navigator.platform);
// Screen width and height
browser_details.push(screen.width + "x" + screen.height);
// Available screen space for the browser.
browser_details.push(screen.availWidth + "x" + screen.availHeight);
// Current date and time. Use Finnish localization
const now = new Date();
const finnishDate = now.toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' });
const finnishTime = now.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
browser_details.push(finnishDate);
browser_details.push(finnishTime);

document.getElementById("target").innerHTML = browser_details.map((detail, index) => `<p>${index + 1}. ${detail}</p>`).join('');