import { db, storage } from './firebase-config.js';

// --- AUTHENTICATION ---
const DASHBOARD_PASSWORD = "itmcxomeet123";
const authOverlay = document.getElementById("authOverlay");
const authForm = document.getElementById("authForm");
const passwordInput = document.getElementById("passwordInput");
const authError = document.getElementById("authError");

const loginBtn = document.getElementById("loginBtn");
const closeAuth = document.getElementById("closeAuth");

function checkAuth() {
    if (sessionStorage.getItem("authenticated") === "true") {
        document.body.classList.add("authenticated");
    } else {
        document.body.classList.remove("authenticated");
    }
}

loginBtn.onclick = () => {
    authOverlay.style.display = "flex";
    passwordInput.focus();
};

closeAuth.onclick = () => {
    authOverlay.style.display = "none";
};

authForm.onsubmit = (e) => {
    e.preventDefault();
    if (passwordInput.value === DASHBOARD_PASSWORD) {
        sessionStorage.setItem("authenticated", "true");
        document.body.classList.add("authenticated");
        authError.style.display = "none";
        authOverlay.style.display = "none";
        passwordInput.value = "";
    } else {
        authError.style.display = "block";
        passwordInput.value = "";
        passwordInput.focus();
    }
};

checkAuth();

document.getElementById("logoutBtn").onclick = () => {
    sessionStorage.removeItem("authenticated");
    document.body.classList.remove("authenticated");
    passwordInput.value = "";
    showToast("Logged out successfully");
};
// ----------------------

const toast = document.getElementById("toast");
function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = type;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    getDocs,
    query
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode";

let alumniData = [
    { id: "A01", name: "Ashok Suvarna", batch: "1995-1998", company: "Aditya Birla Money", designation: "CEO", photo: "Ashok Suvarna 1995-98 Aditya brila mony.jpg" },
    { id: "A02", name: "Kartik Iyer", batch: "2005-2007", company: "Cohizon Life Sciences", designation: "CHRO", photo: "" },
    { id: "A03", name: "Dinesh Pilgaokar", batch: "1991-1993", company: "Barcode India", designation: "Executive VP and CCO", photo: "Dinesh Pilgaokar Image.jfif" },
    { id: "A04", name: "Rahul Chiddarwar", batch: "1996-1998", company: "Unimoni", designation: "CEO", photo: "Rahul Chiddarwar Unimoni.jpg" },
    { id: "A05", name: "Sunjoy Dhawan", batch: "1991-1993", company: "DHL Express India", designation: "CHRO", photo: "Sunjoy Dhawan Image.jfif" },
    { id: "A06", name: "Prashant Nair", batch: "1996-1998", company: "Ambit Capital", designation: "Director", photo: "Prashant Nair Ambit Capital.jpg" },
    { id: "A07", name: "Reet Bhambani", batch: "2003-2005", company: "EMA Partenrs", designation: "MD and COO", photo: "Reet Bhambani EMA partenrs.jpg" },
    { id: "A08", name: "Dipu Ranjan", batch: "2004-2006", company: "HDFC", designation: "Senior VP", photo: "Dipu Rajan Image.jpg" },
    { id: "A09", name: "Hardik Sheth", batch: "2004-2006", company: "Tech Mahindra", designation: "Tech Head", photo: "Hardik Seth Image.jpeg" },
    { id: "A10", name: "Sujeesh Sukumaran", batch: "1993-1995", company: "Pepper Wellness Private Ltd", designation: "Founder", photo: "Sujeesh Sukumaran Pepper Wellness Private Ltd.jpg" },
    { id: "A11", name: "Lalit Kumar Gupta", batch: "", company: "Cotton Corporation of India", designation: "CMD", photo: "" },
    { id: "A12", name: "Vijay Haswani", batch: "2002-2004", company: "Navadhan", designation: "Co-Founder", photo: "Vijay Haswani Image.jfif" },
    { id: "A13", name: "Latika S Kundu", batch: "1994-1996", company: "Metropolitan Stock Exchange", designation: "MD & CEO", photo: "Latika S Kundu Metropolitan Stock Exchange.jpg" },
    { id: "A14", name: "Amitabh Dalal", batch: "2004-2006", company: "UTI", designation: "Vice President", photo: "Amitabh Dalal Utl.jpg" },
    { id: "A15", name: "Siva Rama Kirshna", batch: "2011-2013", company: "LA Technologies Pvt Ltd", designation: "Director- Sales", photo: "Siva Rama Krishna Image.jfif" },
    { id: "A16", name: "Triven Chopra", batch: "2004-2006", company: "NatWest", designation: "Director", photo: "Triven Chopra NATWEST.jpg" },
    { id: "A17", name: "Ankita Kapoor Chopra", batch: "2004-2006", company: "Anand Rathi", designation: "Associate Director", photo: "" },
    { id: "A18", name: "Manav Verma", batch: "2000-2002", company: "IIFL", designation: "CMO", photo: "Manav Verma IIFL.jpg" },
    { id: "A19", name: "Prachi Sahay", batch: "2008-2010", company: "Disney -Hotsar", designation: "Head of Products", photo: "Prachi Sahay Image.jfif" },
    { id: "A20", name: "Richpal Singh", batch: "2006-2008", company: "HDFC Bank", designation: "Senior VP", photo: "" },
    { id: "A21", name: "Shekhar Asnani", batch: "2010-2012", company: "Jefferies", designation: "Director", photo: "Shekhar Asnani Image.jfif" },
    { id: "A22", name: "Arun Bharath", batch: "2007-2009", company: "P & C Insurance Vertical", designation: "Director", photo: "Arun Bharath.png" },
    { id: "A23", name: "Liza Singh", batch: "2010-2012", company: "Kotak Mahindra Singh", designation: "SVP", photo: "Liza Singh Image.jfif" },
    { id: "A24", name: "Nidhi Verma", batch: "2003-2005", company: "Emkay", designation: "Head-Marketing", photo: "Nidhi Verma Emkay.jpg" },
    { id: "A25", name: "Apram Apar", batch: "2002-2004", company: "Ocean Network Express", designation: "General Manager", photo: "Apram Apar Ocean Network Express.jpg" },
    { id: "A26", name: "Ankesh Kumar", batch: "2002-2004", company: "Ingram Micro", designation: "Director", photo: "Ankesh Kumar ingram micro.png" },
    { id: "A27", name: "Anuja Ghosh", batch: "2005-2007", company: "SBICAP ventures", designation: "Head-HR", photo: "Anuja Ghosh Image.jfif" },
    { id: "A28", name: "Virendra Chaudhary", batch: "2010-2012", company: "Algor supply chain", designation: "Founder", photo: "Virendra Chaudhary Algor supply chain.jpg" },
    { id: "A29", name: "Prajwal Rajan", batch: "2005-2007", company: "Hafele", designation: "GM", photo: "Prajwal Rajan Image.jfif" },
    { id: "A30", name: "Jignesh Dawda", batch: "2005-2007", company: "Syntrannia LLP", designation: "Co-Founder & CEO", photo: "Jignesh Dawda Image.jfif" },
    { id: "A31", name: "Anup Bauskar", batch: "2015-2017", company: "Turtle mint", designation: "Associate Director", photo: "" },
    { id: "A32", name: "Ankur Pagariya", batch: "2009-2011", company: "IndusInd Bank", designation: "Vice President", photo: "Ankur Pagariya Indusind bank.jpg" },
    { id: "A33", name: "Mihir Ashar", batch: "1993-1995", company: "Govindji Haridas", designation: "Founder", photo: "Mihir Ashar Govindji Haridas.jpg" },
    { id: "A34", name: "Yashraj Kesharwani", batch: "2012-2014", company: "Times of India", designation: "South India Business Head", photo: "Yashraj Kesharwani.jfif" },
    { id: "A35", name: "Vikram Lalvani", batch: "1995 - 1997", company: "Sterling Holiday Resorts", designation: "MD & CEO", photo: "Vikram Lalvani Sterling Holiday Resorts.jpg" },
    { id: "A36", name: "Naman Rastogi", batch: "2008-2010", company: "Jio Hostar", designation: "Senior Director", photo: "Naman Rastogi Image.jfif" },
    { id: "A37", name: "Santosh Raval", batch: "2012-2014", company: "Axis Bank", designation: "Vice President", photo: "Santosh Raval Axis Bank.jpg" },
    { id: "A38", name: "Shweta Laddha", batch: "2007-2009", company: "Multiple Asset Management", designation: "Head-Compliance", photo: "Shweta Laddha Image.jfif" },
    { id: "A39", name: "Gunjan Malviya", batch: "2007-2009", company: "Experian", designation: "HR-Director", photo: "Gunjan Malviya Experian.jpg" },
    { id: "A40", name: "Rahul Rathi", batch: "2007-2009", company: "FundsIndia Private Wealth", designation: "Market- Director", photo: "Rahul Rathi FundsIndia Private Wealth.png" },
    { id: "A41", name: "Rahul Prasad", batch: "2004-2006", company: "USV Private Ltd", designation: "Vice President", photo: "Rahul Prasad Image.jfif" },
    { id: "A42", name: "Sushma Chopra", batch: "1998-2000", company: "Mondelez international", designation: "Global Lead", photo: "Sushma Chopra Mondelez international.jpg" },
    { id: "A43", name: "Neha Srivastava", batch: "2005-2007", company: "LeadSquared", designation: "Head- people nd culture", photo: "" },
    { id: "A44", name: "Minal Jain", batch: "2008-2010", company: "Leadership Tilit", designation: "Co-founder & Director", photo: "Minal Jain Leadership Tilit.png" },
    { id: "A45", name: "Uday Mathur", batch: "1994-1996", company: "Independent", designation: "Director", photo: "Uday Mathur Image.jfif" },
    { id: "A46", name: "Roshan Damodaran", batch: "", company: "Medusind", designation: "HR Head", photo: "Roshan Damodaran Image.jfif" },
    { id: "A47", name: "Esha Krishnan", batch: "", company: "Mercedez Benz Research & Development India", designation: "HR Head", photo: "Esha Krishnan Image.jfif" },
    { id: "A48", name: "Utpal Das", batch: "2006-2008", company: "EMA Partners", designation: "Clinet Partner", photo: "" },
    { id: "A49", name: "Barun V Mohanty", batch: "2007-2009", company: "Greenply Industries Limited", designation: "General Manager", photo: "Barun V Mohanty Greenply Industries Limited.jpg" },
    { id: "A50", name: "Shalini Singh", batch: "", company: "Hitachi Digital Services", designation: "HR Head", photo: "Shalini Singh Hitachi Digital Services.jpg" },
    { id: "A51", name: "Abhishek Jadav", batch: "2010-2012", company: "Coldman Logistics", designation: "President operations", photo: "" },
    { id: "A52", name: "Shantanu Pattnaik", batch: "", company: "Hindalco Industries Ltd", designation: "Senior GM", photo: "Shantanu Pattnaik Image.jfif" },
    { id: "A53", name: "Meetiksha Takhtani", batch: "2009-2011", company: "Yes Bank", designation: "Senior Vice President", photo: "Meetiksha Takhtani yes bank.jpg" },
    { id: "A54", name: "Ipsita Ansumala", batch: "2003-2005", company: "SAP", designation: "Partner Business Manager", photo: "Ipsita Ansumala SAP.jpg" },
    { id: "A55", name: "Niranjan Prasad Bhagwat", batch: "2003-2005", company: "First Advantage", designation: "Associate Vice President", photo: "Niranjan Prasad Image.jfif" },
    { id: "A56", name: "Vishal Vyas", batch: "2009-2011", company: "DP WORLD", designation: "Director - CPG & Retail Sector", photo: "Vishal Vyas Image.jfif" },
    { id: "A57", name: "Aditya Mittal", batch: "2002-2004", company: "Kellanova", designation: "Head - Commercial Experience", photo: "Aditya Mittal Image.jfif" },
    { id: "A58", name: "Raghuveer Singh", batch: "2007-2009", company: "Zee5", designation: "Vice President Social Media", photo: "Raghuveer Singh Zee5.jpg" }
];

// Global State
let dbState = {
    attendance: {},
    spotRegistrations: [],
    editedAlumni: {}
};

const tableBody = document.getElementById("tableBody");
const batchFilter = document.getElementById("batchFilter");
const companyFilter = document.getElementById("companyFilter");
const searchInput = document.getElementById("searchInput");
const resetBtn = document.getElementById("resetBtn");
const countText = document.getElementById("countText");
const totalAlumni = document.getElementById("totalAlumni");
const exportBtn = document.getElementById("exportBtn");
const printBtn = document.getElementById("printBtn");

// Modals
const qrModal = document.getElementById("qrModal");
const editModal = document.getElementById("editModal");
const spotRegModal = document.getElementById("spotRegModal");
const scannerModal = document.getElementById("scannerModal");

// Forms & Elements
const qrName = document.getElementById("qrName");
const qrcodeDiv = document.getElementById("qrcode");
const downloadQR = document.getElementById("downloadQR");
const scanStatus = document.getElementById("scanStatus");
const spotRegForm = document.getElementById("spotRegForm");
const editForm = document.getElementById("editForm");
const retryCamera = document.getElementById("retryCamera");

function getAllAlumni() {
    const combined = [...alumniData, ...dbState.spotRegistrations];
    const resolved = combined.map(a => {
        if (dbState.editedAlumni[a.id]) {
            return { ...a, ...dbState.editedAlumni[a.id] };
        }
        return a;
    });

    // Alphabetical Sorting
    return resolved.sort((a, b) => a.name.localeCompare(b.name));
}

function unique(arr) { return [...new Set(arr)]; }

function populateFilters() {
    const allData = getAllAlumni();
    const batches = unique(allData.map(a => a.batch).filter(b => b && b.trim() !== "")).sort();
    const companies = unique(allData.map(a => a.company).filter(c => c && c.trim() !== "")).sort();

    batchFilter.innerHTML = '<option value="all">All Batches</option>';
    companyFilter.innerHTML = '<option value="all">All Companies</option>';

    batches.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.textContent = b;
        batchFilter.appendChild(opt);
    });

    companies.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        companyFilter.appendChild(opt);
    });
}

function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(a => {
        const tr = document.createElement("tr");
        const isPresent = dbState.attendance[a.id] === true;
        const statusClass = isPresent ? "status-present" : "status-absent";
        const statusText = isPresent ? "Present" : "Absent";

        const photoSrc = (a.photo && a.photo.startsWith('http')) ? a.photo : `/${a.photo}`;
        const photoHTML = a.photo
            ? `<img class="avatar" src="${photoSrc}" alt="${a.name}" onerror="console.log('Failed to load image:', this.src); this.style.display='none'; this.parentElement.innerHTML='<div class=\\'empty-avatar\\'></div>';">`
            : `<div class="empty-avatar"></div>`;

        tr.innerHTML = `
      <td class="photo-cell">${photoHTML}</td>
      <td><b>${a.name}</b></td>
      <td>${a.batch ? a.batch : "-"}</td>
      <td>${a.company}</td>
      <td>${a.designation}</td>
       <td><span class="status-badge ${statusClass}" id="status-${a.id}">${statusText}</span></td>
        <td class="admin-only"><button class="qr-btn" id="qr-${a.id}">View QR</button></td>
        <td class="admin-only">
            <button class="qr-btn" style="background:#ffc107;" id="edit-${a.id}">Edit</button>
            <button class="qr-btn" style="background:#dc3545; color:#fff; border-color:#dc3545;" id="remove-${a.id}">Remove</button>
        </td>
      `;

        tableBody.appendChild(tr);

        // Event Listeners for dynamic buttons
        document.getElementById(`status-${a.id}`).onclick = () => toggleStatus(a.id);
        document.getElementById(`qr-${a.id}`).onclick = () => showQR(a.id, a.name);
        document.getElementById(`edit-${a.id}`).onclick = () => openEditModal(a.id);
        document.getElementById(`remove-${a.id}`).onclick = () => removePerson(a.id, a.name);
    });

    countText.textContent = `Showing ${data.length} records`;
    // totalAlumni.textContent = data.length; // Removed
}

function applyFilters() {
    const batchVal = batchFilter.value;
    const companyVal = companyFilter.value;
    const searchVal = searchInput.value.toLowerCase();

    const allData = getAllAlumni();
    const filtered = allData.filter(a => {
        const matchBatch = (batchVal === "all") || (a.batch === batchVal);
        const matchCompany = (companyVal === "all") || (a.company === companyVal);
        const matchSearch = a.name.toLowerCase().includes(searchVal);
        return matchBatch && matchCompany && matchSearch;
    });

    renderTable(filtered);
}

async function toggleStatus(id) {
    if (sessionStorage.getItem("authenticated") !== "true") {
        showToast("Admin access required", "error");
        return;
    }

    // Confirmation Alert
    const all = getAllAlumni();
    const p = all.find(x => x.id === id);
    const newStatus = !dbState.attendance[id];
    const statusLabel = newStatus ? "PRESENT" : "ABSENT";

    if (!confirm(`Are you sure you want to mark ${p.name} as ${statusLabel}?`)) {
        return;
    }

    await setDoc(doc(db, "attendance", id), { present: newStatus });
}

async function markPresent(id) {
    if (sessionStorage.getItem("authenticated") !== "true") return;
    await setDoc(doc(db, "attendance", id), { present: true });
}

async function removePerson(id, name) {
    if (confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) {
        try {
            await Promise.all([
                deleteDoc(doc(db, "alumni", id)),
                deleteDoc(doc(db, "spotRegistrations", id)),
                deleteDoc(doc(db, "attendance", id)),
                deleteDoc(doc(db, "editedAlumni", id))
            ]);
            showToast(`${name} has been removed.`);
        } catch (err) {
            console.error("Delete error:", err);
            showToast("Failed to remove person: " + err.message, "error");
        }
    }
}

window.showQR = async function (id, name) {
    qrName.textContent = `QR Code for ${name}`;
    qrcodeDiv.innerHTML = "";
    qrModal.style.display = "flex";

    try {
        const url = await QRCode.toDataURL(id, { width: 256, margin: 2 });
        const img = document.createElement("img");
        img.src = url;
        qrcodeDiv.appendChild(img);

        downloadQR.onclick = () => {
            const link = document.createElement("a");
            link.href = url;
            link.download = `QR_${name.replace(/\s+/g, '_')}.png`;
            link.click();
        };
    } catch (err) {
        console.error(err);
    }
};

window.openEditModal = function (id) {
    const allData = getAllAlumni();
    const person = allData.find(a => a.id === id);
    if (!person) return;

    document.getElementById("editId").value = person.id;
    document.getElementById("editName").value = person.name;
    document.getElementById("editBatch").value = person.batch || "";
    document.getElementById("editCompany").value = person.company || "";
    document.getElementById("editDesignation").value = person.designation || "";
    document.getElementById("editPhotoUrl").value = person.photo || "";
    document.getElementById("editPhotoFile").value = "";

    editModal.style.display = "flex";
};

// Listeners
batchFilter.onchange = applyFilters;
companyFilter.onchange = applyFilters;
searchInput.oninput = applyFilters;

resetBtn.onclick = () => {
    batchFilter.value = "all";
    companyFilter.value = "all";
    searchInput.value = "";
    const allData = getAllAlumni();
    const presentMembers = allData.filter(a => dbState.attendance[a.id] === true);
    renderTable(presentMembers);
};

document.getElementById("showAllBtn").onclick = () => {
    batchFilter.value = "all";
    companyFilter.value = "all";
    searchInput.value = "";
    applyFilters();
};

exportBtn.onclick = () => {
    const allData = getAllAlumni();
    const headers = ["Name", "Batch", "Company Name", "Designation"];
    const rows = allData.map(a => [a.name, a.batch || "", a.company, a.designation]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cxo_meet_alumni.csv";
    link.click();
    URL.revokeObjectURL(url);
};

printBtn.onclick = () => window.print();

document.getElementById("closeQR").onclick = () => { qrModal.style.display = "none"; };
document.getElementById("closeEdit").onclick = () => { editModal.style.display = "none"; };
document.getElementById("closeSpotReg").onclick = () => { spotRegModal.style.display = "none"; };
document.getElementById("closeScanner").onclick = () => {
    retryCamera.style.display = "none";
    if (html5QrCode && (html5QrCode.getState() === 2 || html5QrCode.getState() === 3)) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            scannerModal.style.display = "none";
        }).catch(() => {
            scannerModal.style.display = "none";
        });
    } else {
        scannerModal.style.display = "none";
    }
};

document.getElementById("openSpotRegBtn").onclick = () => { spotRegModal.style.display = "flex"; };
document.getElementById("openScannerBtn").onclick = () => {
    scannerModal.style.display = "flex";
    startScanner();
};

spotRegForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Registering...";
    btn.disabled = true;

    const name = document.getElementById("regName").value;
    const batch = document.getElementById("regBatch").value;
    const company = document.getElementById("regCompany").value;
    const designation = document.getElementById("regDesignation").value;

    const newId = "S" + Date.now();
    const newPerson = { id: newId, name, batch, company, designation, photo: "" };

    try {
        await setDoc(doc(db, "spotRegistrations", newId), newPerson);
        await setDoc(doc(db, "attendance", newId), { present: true });

        spotRegForm.reset();
        spotRegModal.style.display = "none";
        showToast(`Successfully registered ${name}!`);
    } catch (err) {
        console.error("Registration error:", err);
        showToast("Registration failed: " + err.message, "error");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
};

editForm.onsubmit = async (e) => {
    e.preventDefault();
    const subBtn = e.target.querySelector('button[type="submit"]');
    const originalText = subBtn.textContent;
    subBtn.disabled = true;
    subBtn.textContent = "Saving...";

    try {
        const id = document.getElementById("editId").value;
        const name = document.getElementById("editName").value;
        const batch = document.getElementById("editBatch").value;
        const company = document.getElementById("editCompany").value;
        const designation = document.getElementById("editDesignation").value;
        let photo = document.getElementById("editPhotoUrl").value;

        const fileInput = document.getElementById("editPhotoFile");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = ref(storage, `alumni-photos/${id}/${file.name}`);
            await uploadBytes(storageRef, file);
            photo = await getDownloadURL(storageRef);
        }

        await setDoc(doc(db, "editedAlumni", id), { name, batch, company, designation, photo });
        editModal.style.display = "none";
        showToast("Details updated successfully!");
    } catch (err) {
        console.error("Update error:", err);
        showToast("Error updating details: " + err.message, "error");
    } finally {
        subBtn.disabled = false;
        subBtn.textContent = originalText;
    }
};

// Scanner Logic
let html5QrCode = null;

async function startScanner() {
    scanStatus.textContent = "Initializing camera...";
    scanStatus.style.color = "#111";
    retryCamera.style.display = "none";

    // 1. Cleanup existing
    if (html5QrCode) {
        try {
            if (html5QrCode.getState() === 2) await html5QrCode.stop();
            html5QrCode.clear();
        } catch (e) { console.error("Cleanup error", e); }
    }

    html5QrCode = new Html5Qrcode("reader");

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // 2. Try starting with environment (back) camera
    try {
        await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess);
        scanStatus.textContent = "Scanner Active - Align QR Code";
        scanStatus.style.color = "#28a745";
    } catch (err) {
        console.warn("Environment camera failed, trying device list...", err);
        // 3. Fallback: try to find any camera
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                // Try the last one (often the back camera on Android)
                await html5QrCode.start(devices[devices.length - 1].id, config, onScanSuccess);
                scanStatus.textContent = "Scanner Active - Align QR Code";
                scanStatus.style.color = "#28a745";
            } else {
                throw new Error("No cameras found.");
            }
        } catch (err2) {
            console.error("Scanner fallback failed", err2);
            scanStatus.textContent = "Camera Error: " + (err2.message || err2);
            scanStatus.style.color = "red";
            retryCamera.style.display = "block";
        }
    }
}

function onScanSuccess(decodedText) {
    const allData = getAllAlumni();
    const person = allData.find(p => p.id === decodedText);
    if (person) {
        markPresent(decodedText);
        scanStatus.textContent = `SUCCESS: Marked ${person.name} as Present!`;
        scanStatus.style.color = "green";
        // Optional: vibration feedback if supported
        if (navigator.vibrate) navigator.vibrate(200);
    } else {
        scanStatus.textContent = "Error: Invalid QR Code";
        scanStatus.style.color = "red";
    }
}

retryCamera.onclick = () => startScanner();

// Initializing Real-time Listeners
function initListeners() {
    onSnapshot(collection(db, "attendance"), (snapshot) => {
        snapshot.forEach(doc => {
            dbState.attendance[doc.id] = doc.data().present;
        });
        applyFilters();
    });

    onSnapshot(collection(db, "spotRegistrations"), (snapshot) => {
        dbState.spotRegistrations = snapshot.docs.map(doc => doc.data());
        populateFilters();
        applyFilters();
    });

    onSnapshot(collection(db, "editedAlumni"), (snapshot) => {
        snapshot.forEach(doc => {
            dbState.editedAlumni[doc.id] = doc.data();
        });
        populateFilters();
        applyFilters();
    });

    onSnapshot(collection(db, "alumni"), (snapshot) => {
        if (!snapshot.empty) {
            alumniData = snapshot.docs.map(doc => doc.data());
            populateFilters();
            applyFilters();
        }
    });
}

initListeners();
populateFilters();
applyFilters();
