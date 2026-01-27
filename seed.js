import { db } from './firebase-config.js';
import { doc, setDoc } from "firebase/firestore";

const alumniData = [
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

const imageFiles = [
    "Abhishek Singh Adani Group.jpg",
    "Aditya Mittal Image.jfif",
    "Akhil Mathur Anand Rathi.jpg",
    "Amitabh Dalal Utl.jpg",
    "Ankesh Kumar ingram micro.png",
    "Ankur Pagariya Indusind bank.jpg",
    "Anoop Sharma KPMG.jpg",
    "Anshuman Shrivastava BC Jindal Group.jpg",
    "Anuja Ghosh Image.jfif",
    "Apram Apar Ocean Network Express.jpg",
    "Arun Bharath.png",
    "Ashok Suvarna 1995-98 Aditya brila mony.jpg",
    "Barun V Mohanty Greenply Industries Limited.jpg",
    "Bharat Parekh CLSA 1991-93.jpg",
    "Bindu Menon PointBlank Healthcare Communications.jpg",
    "Dhananjay Singh Kushwah FOMOSO.jpg",
    "Dinesh Pilgaokar Image.jfif",
    "Dipesh Gajera yes bank.jpg",
    "Dipu Rajan Image.jpg",
    "Esha Krishnan Image.jfif",
    "Gopinadhan K EMA Partners.jpg",
    "Gunjan Malviya Experian.jpg",
    "Hardik Seth Image.jpeg",
    "Ipsita Ansumala SAP.jpg",
    "Jignesh Dawda Image.jfif",
    "Latika S Kundu Metropolitan Stock Exchange.jpg",
    "Liza Singh Image.jfif",
    "Manav Verma IIFL.jpg",
    "Meetiksha Takhtani yes bank.jpg",
    "Mihir Ashar Govindji Haridas.jpg",
    "Minal Jain Leadership Tilit.png",
    "Naman Rastogi Image.jfif",
    "Naresh Sharma IRHPL Group of Companies.jpg",
    "Naveen Adiraju Dream New Tech.jpg",
    "Nidhi Verma Emkay.jpg",
    "Nikhil Mathur Narayana Health.jpg",
    "Niranjan Prasad Image.jfif",
    "Nitin Nair Alliance Insurance Broker.jpg",
    "Pooja Minocha bata india.jpg",
    "Prachi Sahay Image.jfif",
    "Prajwal Rajan Image.jfif",
    "Prashant Nair Ambit Capital.jpg",
    "Pritam Kumar  Writer Information.jpg",
    "Raghuveer Singh Zee5.jpg",
    "Rahil Rathi Image.png",
    "Rahul Chiddarwar Unimoni.jpg",
    "Rahul Prasad Image.jfif",
    "Rahul Rathi FundsIndia Private Wealth.png",
    "Rajashekhar Reddy Polycab India Limited.jpg",
    "Rakhi Shaha GyroHR.jpg",
    "Ranganathan Rajagopalan Sundaram Fasteners Limited.jpg",
    "Raveesh Unny Standard Chartered.jpg",
    "Reet Bhambani EMA partenrs.jpg",
    "Rohit Rajendran Bombay Branding Company.jpg",
    "Ronak Sheth Opium Eyewear.jpg",
    "Roshan Damodaran Image.jfif",
    "Sahil Kapoor DSP Mutual funds.png",
    "Santosh Raval Axis Bank.jpg",
    "Shalini Singh Hitachi Digital Services.jpg",
    "Shantanu Pattnaik Image.jfif",
    "Shekhar Asnani Image.jfif",
    "Shweta Laddha Image.jfif",
    "Sidharth Pratap Cognizant Technology Solutions.jpg",
    "Siva Rama Krishna Image.jfif",
    "Sourjya Mohanty DocuBay.jpg",
    "Sousthav Chakrabarty Siply.jpg",
    "Sujeesh Sukumaran Pepper Wellness Private Ltd.jpg",
    "Sumit Jaiswal Grover Zampa Vineyards.jpg",
    "Sunjoy Dhawan Image.jfif",
    "Sushma Chopra Mondelez international.jpg",
    "Sweta Kakati Starbucks.jpg",
    "Tarandeep Singh Sekhon KidZania India.jpg",
    "Triven Chopra NATWEST.jpg",
    "Uday Mathur Image.jfif",
    "Vijay Haswani Image.jfif",
    "Vikram Lalvani Sterling Holiday Resorts.jpg",
    "Virendra Chaudhary Algor supply chain.jpg",
    "Vishal Vyas Image.jfif",
    "Yashraj Kesharwani.jfif"
];

function seed() {
    const finalAlumni = [...alumniData];
    const existingNames = new Set(alumniData.map(a => a.name.toLowerCase()));
    const existingPhotos = new Set(alumniData.map(a => a.photo).filter(p => !!p));

    imageFiles.forEach(file => {
        if (existingPhotos.has(file)) return;

        // Extract name and potentially company from filename
        // Format: "Name Potentially Company.ext"
        // Heuristic: remove extension, remove common words like "Image", "jfif", then split.
        let clean = file.replace(/\.(jpg|png|jfif|jpeg)$/i, "");
        clean = clean.replace(/\s(Image|jfif|png|jpg|jpeg)$/i, "");

        // Some filenames have metadata like batch or company
        // Ashok Suvarna 1995-98 Aditya brila mony
        // Let's try to split by space and take first two words as name
        const parts = clean.split(/\s+/);
        const name = parts.slice(0, 2).join(" ");
        const company = parts.slice(2).join(" ") || "Unknown";

        if (!existingNames.has(name.toLowerCase())) {
            const id = "A" + (finalAlumni.length + 1).toString().padStart(2, '0');
            finalAlumni.push({
                id,
                name,
                company,
                batch: "",
                designation: "",
                photo: file
            });
            existingNames.add(name.toLowerCase());
        }
    });

    console.log(`Seeding ${finalAlumni.length} alumni...`);

    async function runSeeding() {
        for (const a of finalAlumni) {
            try {
                await setDoc(doc(db, "alumni", a.id), a);
                console.log(`✅ Seeded: ${a.name} (${a.id})`);
            } catch (err) {
                console.error(`❌ Failed: ${a.name} (${a.id}) - ${err.message}`);
            }
        }
        console.log("Seeding process finished!");
        process.exit(0);
    }

    runSeeding();
}

seed();
