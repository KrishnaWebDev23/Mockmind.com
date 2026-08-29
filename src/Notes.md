1. ## Supabase
- getSession() async hai, isliye ProtectedRoute 2 renders leta hai
- RLS disable kiya tha 401 fix karne ke liye → production mein fix karna hai
- Jab hum getSession() karte h to chahe humne login ya register nhi kiya ho phir bhi supabase response bhejta h chahe vo null hi ho 
- Supabase ma password koi bhi nhi dekh sakta h khud supabase bhi nhi ye password ko encripted ki jagha bcrypted format se save          
  karte taki password ko match karne ke liye decrypt na karna pade.
- Supabase sirf email and password database ma save karta h agar hame username ya other credientials save karwane h to alag se 
  table banane padti h 
- Supabase ma project enter karne ka baad uske sidebar ke ander table Editor hota h jisme only username and other credentials
- store hote and authentication wale nav ma email and password (bcrypted) store hote h

2. ## MockMind — AI Architecture Notes

2.1 Kyun Two AI Use Kiye?

Maine decide kiya ki MockMind mein do alag AI models use karunga — Gemini 2.5 Flash aur Groq + LLaMA. Reason simple tha — dono ki strengths alag hain. Gemini reasoning mein better hai but thoda slow hai. Groq utna powerful nahi hai reasoning mein but bohot fast hai — sub-second response deta hai. Toh socha kyun na dono ko unki strength ke hisaab se kaam doon.

---

2.2 Kisne Kya Kaam Karna Hai

Gemini do jagah use hoga — session start mein jab 5 interview questions generate karne hain, aur session end mein jab poori conversation evaluate karni hai aur detailed feedback dena hai. Ye dono "thinking" tasks hain jahan user ek baar wait kar sakta hai — 2-4 second ka delay acceptable hai.

Groq sirf ek kaam karega — mid-interview follow-up questions. Jab user koi answer deta hai toh turant ek follow-up question aana chahiye. Agar 3-4 second lag gaye toh conversation ka flow toot jaata hai aur real interview jaisa feel nahi aata. Isliye Groq yahan perfect hai.

---

2.3 RPM, TPM aur RPD — Kya Hota Hai

Teen limits hain jo mujhe yaad rakhni hain —

**RPM** matlab Requests Per Minute — ek minute mein kitni baar API call kar sakta hoon. Ye exceed ho toh sirf 1 minute rukna padta hai, phir reset ho jaata hai.

**TPM** matlab Tokens Per Minute — ek minute mein kitne tokens process ho sakte hain. Ye bhi 1 minute mein reset ho jaata hai.

**RPD** matlab Requests Per Day — poore din mein kitni requests kar sakta hoon. Ye sabse dangerous limit hai kyunki agar ye khatam ho gayi toh kal midnight UTC tak kuch nahi ho sakta. RPM aur TPM self-healing hain — RPD nahi.

---

2.4 Dono Ki Actual Limits

Gemini 2.5 Flash free tier mein RPM 15 hai, TPM 1 million hai, aur RPD 1,500 hai. TPM itna zyada isliye diya hai kyunki Gemini badi requests handle karta hai — jaise poori conversation ek saath evaluation ke liye.

Groq free tier mein RPM 30 hai, TPM 6,000 hai, aur RPD 1,000 hai. TPM kam hai but Groq sirf short follow-up questions de raha hai toh tokens bhi kam use honge.

Dono ka free tier permanent hai — koi expiry nahi. Credit card bhi nahi chahiye.

---

2.5 Ek Session Mein Kitni API Calls

Ek poore interview session mein total 7 API calls hoti hain. Gemini ki 2 calls — ek questions generate karne ke liye, ek evaluation ke liye. Groq ki 5 calls — har main question ke baad ek follow-up. Matlab RPD pe bohot kam load padta hai. Agar 100 users bhi din mein 3 sessions karein toh bhi dono ke limits safe rahenge.

---

2.6 Fallback Architecture

Agar kisi ek AI ka RPD khatam ho jaye ya koi error aaye toh dusra AI automatically kaam sambhal lega. Groq fail kare toh Gemini follow-up dega. Gemini fail kare toh Groq evaluation karega. User ko pata bhi nahi chalega ki switch hua.

---

2.7 RPD Bachane Ka Tarika

Sabse important rule — ek request mein zyada se zyada kaam nikaalo. Jaise 5 questions alag alag 5 calls mein mat maango — ek hi call mein saare 5 questions JSON format mein maango. Isse RPD bachti hai aur speed bhi better hoti hai.

3. ## React useCallback and react-dropzone

3.1 Function ek object hai

JavaScript mein jab bhi tum function likhte ho, woh memory mein ek object ki tarah store hota hai. Variable us object ko store nahi karta — sirf uska address store karta hai. Jaise ghar ka address hota hai, ghar nahi.
Jab component re-render hota hai, function dobara define hota hai aur memory mein naya object banta hai with naya address. Chahe woh function kabhi call na hua ho — sirf define hone se naya address mil jaata hai.

3.2 useCallback kya karta hai

useCallback ek memory slot rakhta hai. Pehli baar naya function banata hai aur slot mein save karta hai. Doosri baar render hone pe pehle slot check karta hai — agar dependency same hai toh wahi purana address return kar deta hai, naya object nahi banata. Isliye reference stable rehta hai.

3.3 useDropzone ek security guard hai

Tum useDropzone ko teen cheezein bolta ho — accept matlab sirf PDF aane do, maxFiles matlab sirf 1 file, aur onDrop matlab jab file pass ho jaaye tab yeh kaam karo. Guard pehle file check karta hai, sab theek hone pe tumhara onDrop function bulata hai.

3.4 Yeh kabhi mat karo

Agar onDrop ko uski khud ki dependency mein daalo toh infinite loop ban jaata hai. Matlab — jab onDrop banta hai, dependency check hoti hai, onDrop badla, naya onDrop banta hai, phir check hoti hai, phir badla — yeh kabhi nahi rukta aur app crash ho jaati hai. Function khud apna trigger nahi ban sakta.