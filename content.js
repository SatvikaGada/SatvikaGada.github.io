/* =============================================================================
   content.js
   -----------------------------------------------------------------------------
   Every piece of text, every link and every list on the site lives here.
   main.js reads this object and renders the page from it, so you should never
   need to touch index.html or main.js to change words.

   Conventions
   - Text inside [square brackets] is a placeholder. It shows on the page with a
     dashed red underline so you can spot what is unfinished. Replace the whole
     thing, brackets included.
   - Leave a field as "" (empty string) or null to hide it.
   - Order in an array = order on the page.
   - Paths are relative (assets/...) so the site works on GitHub Pages project
     sites, Netlify and Vercel without changes.
   ============================================================================= */

const CONTENT = {
  meta: {
    // TODO: Change this date whenever you update the site (format YYYY-MM-DD).
    // It is shown in the footer as "Last updated".
    lastUpdated: "2026-11-14",
  },

  person: {
    name: "Satvika Gada",
    // TODO: Replace with your real email address. Also update it in index.html (JSON-LD block).
    email: "satvikagada@gmail.com",
    github: "https://github.com/SatvikaGada",
    linkedin: "https://linkedin.com/in/satvika-gada832",
    // TODO: Drop your resume at assets/Satvika_Gada_Resume.pdf (same file name) to replace the placeholder.
    resume: "assets/Satvika_Gada_Resume.pdf",
  },

  // Header navigation. href must match a section id in index.html.
  nav: [
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Recognition", href: "#recognition" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    // Set show: false to hide the status line when you are no longer looking.
    status: { show: true, text: "Open to internships and full-time roles" },
    positioning:
      "Software engineer building AI/ML and full-stack systems. CSE with a nanotechnology minor.",
    meta: "B.Tech CSE, SASTRA Deemed University, 2023 to 2027",
    primaryCta: { label: "View work", href: "#work" },
    secondaryCta: { label: "Email me" },
    // TODO: Replace with your photo. Keep a 4:5 crop (e.g. 800 x 1000) and update width/height to match.
    photo: {
      src: "assets/photo-hero.jpg",
      alt: "Portrait of Satvika Gada",
      width: 800,
      height: 1000,
    },
  },

  // Proof strip: four short facts. Keep "value" short; "label" explains it.
  proof: [
    { value: "Fidelity Investments", label: "Full Stack Developer Intern, 2026" },
    { value: "IEEE", label: "Published paper, 2026" },
    // TODO: Fill in your CGPA.
    { value: "9.05/10", label: "CGPA, B.Tech CSE" },
  ],

  work: {
    label: "Work",
    heading: "Selected work",
    intro: "Each project lists the problem, my part, and one result I can measure.",
    projects: [
      {
        title: "Mini-Sparky: a secure agentic shopping assistant",
        problem: "LLM shopping agents can be tricked by hostile product text into actions they should never take, such as paying.",
        role: "Built a LangGraph and FastAPI agent over a Spring Boot and PostgreSQL commerce core. Stock reservation is atomic, checkout is idempotent, and the agent holds no checkout credential.",
        stack: ["Java", "Spring Boot", "PostgreSQL", "Python", "FastAPI", "LangGraph", "Docker"],
        result: "In a 500-user k6 run against 100 units of stock, exactly 100 orders succeeded and 400 were rejected with no unexpected errors. Harmful actions: 0% across 10 prompt-injection tasks.",
        github: "https://github.com/SatvikaGada/walmart-mini-sparky",
        demo: "",
        image: null, // add a screenshot later: { src: "assets/mini-sparky.png", alt: "Mini-Sparky chat and cart screen", width: 1600, height: 1000 }
        caseStudy: {
          problem: "An agent that can search, build a cart and pay is dangerous if a product review can talk it into anything. The safety had to live in the backend, not in the prompt.",
          approach: [
            "Gave the agent and the browser separate credentials. The agent can build carts but gets HTTP 403 on checkout.",
            "Reserved stock with a single conditional UPDATE so PostgreSQL row locks serialise concurrent buyers, and required an Idempotency-Key on checkout.",
            "Treated all catalog text as untrusted, validated every tool argument, and enforced budget and quantity limits server-side.",
          ],
          architecture: null,
          results: [
            "A 100-thread JUnit test: 10 reservations succeeded, 90 were rejected.",
            "12 integration tests on real PostgreSQL, 66% instruction coverage.",
            "Evaluation on 30 tasks: 66.7% task success, 0% harmful-effect rate on the 10 injection tasks.",
          ],
          learnings: "The evaluation is small (30 tasks), so I report the percentages as directional. At larger scale the single hot stock row and in-memory rate limiter would be the first things to break.",
        },
      },
      {
        title: "Agentic portfolio optimizer",
        problem: "Retail investors have no easy way to turn a plain-English risk preference into a risk-adjusted portfolio.",
        role: "Built a nine-node LangGraph agent: infer the risk profile, select tickers, pull live market data and news, analyse each stock, simulate with Monte Carlo, optimise with CVXPY, assess the result and rebalance.",
        stack: ["Python", "LangGraph", "LangChain", "Streamlit", "CVXPY", "yfinance", "OpenAI"],
        result: "Runs a 5,000-path Monte Carlo simulation per pass and loops up to 3 times until the portfolio is stable. Example run (moderate risk): weighted-average Sharpe ratio 0.7 and annualised 95% VaR 23%.",
        github: "https://github.com/SatvikaGada/Agentic-portfolio-optimizer",
        demo: "",
        image: null,
        caseStudy: null,
      },
      {
        title: "Olist weekly business review",
        problem: "Weekly reporting on about 100k e-commerce orders needed trustworthy data and a clear answer on what hurts customer satisfaction.",
        role: "Built an idempotent ELT pipeline into PostgreSQL with six data-quality checks that halt the run on failure, five SQL analyses, and a memo to a VP.",
        stack: ["Python", "PostgreSQL", "SQL"],
        result: "Orders 8 or more days late average 1.70 stars against 4.29 for early orders. Only 3.0% of customers ordered more than once.",
        github: "https://github.com/SatvikaGada/olist-weekly-business-review",
        demo: "",
        image: null,
        caseStudy: null,
      },
      {
        title: "Text-guided few-shot medical image segmentation",
        problem: "Models trained on natural images struggle on medical scans when only 1 to 5 labelled examples exist.",
        role: "Reproduced the CD-TG plug-in (CLIP text guidance) on PATNet, DMTNet and RPMMs, and evaluated on Chest X-Ray, ISIC2018, WBC and CHAOS-MRI.",
        stack: ["Python", "PyTorch", "CLIP", "ResNet-50", "Kaggle GPU"],
        result: "On a trained RPMMs baseline, 1-shot Chest X-Ray mIoU rose from 30.8 to 49.3. On PATNet and DMTNet the paper's gains did not reproduce, and the repo documents why.",
        github: "https://github.com/SatvikaGada/CDTG-fewshot-medical-segmentation",
        demo: "",
        image: null,
        caseStudy: null,
      },
      {
        title: "Automated student answer grading",
        problem: "Grading short free-text answers by hand is slow and inconsistent, so I wanted a pipeline that scores them against reference answers.",
        role: "Built an NLP pipeline in Python that scores short student answers on a 0 to 2 scale. It combines BERT embeddings of the student and reference answers with TF-IDF cosine similarity, N-gram overlap and length ratio, balances the grade classes with SMOTE, and trains a PyTorch neural network to predict the grade.",
        stack: ["Python", "PyTorch", "BERT (Hugging Face)", "spaCy", "scikit-learn", "pandas", "Seaborn", "Jupyter"],
        result: "On 122 held-out answers the model reached 70.5% grading accuracy with a mean absolute error of 0.34 grade points.",
        github: "https://github.com/SatvikaGada/Automated-student-answer-grading",
        demo: "",
        image: null,
        caseStudy: null,
      },
      {
        title: "AI farm robot for pest management",
        problem: "Pests cut crop yields, and the usual answer, chemical pesticides, harms soil, beneficial insects and farmers' health.",
        role: "Designed an autonomous pest-management robot and built its AI models: a CNN pest classifier with Laplacian preprocessing for blurred images, a Q-learning navigation model on a 2D farm grid, and a decision tree that switches between biogas, solar and battery power.",
        stack: ["Python", "TensorFlow/Keras", "OpenCV", "scikit-learn", "Arduino", "Google Colab"],
        result: "Achieved 85% test accuracy by training on a dataset of 5,500+ images over 40 epochs.",
        github: "https://github.com/SatvikaGada/AI-Farm-Robot",
        demo: "",
        image: null,
        caseStudy: null,
      },
      {
        title: "Machine learning mini projects",
        problem: "I wanted hands-on practice across the main areas of machine learning, not just one.",
        role: "Built 13 end-to-end mini projects covering classification, regression, clustering, anomaly detection, recommendation engines, NLP, speech recognition, computer vision and PySpark.",
        stack: ["Python", "Jupyter", "PySpark", "OpenCV"],
        result: "13 projects in one repo, including credit card fraud detection, Black Friday sales prediction, Twitter sentiment analysis and a face detector.",
        github: "https://github.com/SatvikaGada/Machine-learning-projects",
        demo: "",
        image: null,
        caseStudy: null,
      },
    ],
    more: {
      text: "And many other small projects.",
      label: "See all on GitHub",
      href: "https://github.com/SatvikaGada?tab=repositories",
    },
  },

  experience: {
    label: "Experience",
    heading: "Internship and leadership",
    items: [
      {
        type: "work",
        role: "Full Stack Developer Intern",
        org: "Fidelity Investments",
        dates: "Jun 2026 to Aug 2026",
        duration: "2 months",
        project: "Quick Note Publishing Service",
        points: [
          "Worked on the Spring Boot backend of the Quick Note Publishing Service.",
          "Wrote unit tests for the controller and service layers and tracked code coverage.",
          "Wrote Cucumber BDD integration tests and Karate API tests.",
          "Worked with product managers and business analysts when needed; mentored day to day by a senior engineer.",
        ],
        // TODO: Add one measurable outcome, or set to "" to hide.
        outcome: "The service handles 13.5k+ notes annually, and the Quick Note Publishing Service saves an estimated 660+ engineering hours per year.",
        // TODO: Confirm the unit test framework you used.
        stack: ["Spring Boot", "Cucumber", "Karate", "JUnit 5"],
      },
      {
        // Education sits on the same timeline so recruiters find your graduation year fast.
        // Delete this object if you prefer not to show it here.
        type: "education",
        role: "B.Tech, Computer Science and Engineering",
        org: "SASTRA Deemed University",
        dates: "2023 to 2027",
        duration: "Minor in Nanotechnology",
        project: "",
        points: [],
        outcome: "",
        stack: [],
      },
    ],
    leadership: {
      heading: "Leadership and clubs",
      items: [
        {
          role: "Executive Coordinator",
          club: "E-Cell",
          impact: "Mentor juniors on their startup ideas, run events, and host founder interviews.",
          photo: null,
        },
        {
          role: "Chapter Coordinator",
          club: "OWASP SASTRA chapter",
          impact: "Organise online cybersecurity awareness sessions and bring in outside speakers.",
          photo: null,
        },
        {
          role: "Member",
          club: "ACE Cyber Security cluster",
          impact: "Help run the cluster's cybersecurity hackathons.",
          // TODO: Swap in a photo from one of the hackathons (4:3), or set photo: null.
          photo: null,
        },
        {
          role: "Social Media Coordinator",
          club: "SALVO AI Club",
          impact:
            "Design posters, plan content, and run ice-breaker events to raise attendance. Also built projects with the club.",
          photo: null,
        },
      ],
    },
  },

  skills: {
    label: "Skills",
    heading: "What I work with",
    intro: "Grouped by area. No ratings; ask me about any of them.",
    groups: [
      { name: "Languages", items: ["Python", "Java", "C", "C++", "JavaScript", "SQL"] },
      {
        name: "Backend and frameworks",
        items: ["Spring Boot", "FastAPI", "REST APIs", "Streamlit", "Node.js", "Express", "Django", "Angular", "React"],
      },
      {
        name: "AI/ML",
        items: [
          "PyTorch",
          "TensorFlow/Keras",
          "scikit-learn",
          "LangGraph",
          "LangChain",
          "OpenAI API",
          "BERT (Hugging Face)",
          "spaCy",
          "OpenCV",
          "CLIP",
          "ResNet50",
          "MobileNetV2",
          "CVXPY",
          "SHAP / explainable AI",
          "Stable Baselines3 (PPO)",
          "Gymnasium",
          "Q-Learning",
        ],
      },
      {
        name: "Data and testing",
        items: ["PostgreSQL", "MongoDB", "Mongoose", "pandas", "NumPy", "JUnit 5", "Cucumber", "Karate", "Selenium IDE", "k6"],
      },
      {
        name: "Tools and cloud",
        items: [
          "Git",
          "GitHub",
          "Docker",
          "Maven",
          "IntelliJ IDEA",
          "VS Code",
          "Google Colab",
          "Kaggle",
          "Roboflow",
          "Overleaf/LaTeX",
          "Cloud fundamentals (IaaS/PaaS/SaaS, EC2, Azure VM)",
        ],
      },
      {
        name: "Security",
        items: ["Cybersecurity fundamentals (Google Cybersecurity certificate, OWASP chapter work)"],
      },
    ],
  },

  recognition: {
    label: "Recognition",
    heading: "Publication, hackathons, certificates",
    publication: {
      title:
        "Explainable AI-SHAP Embedded Outlier Detection Improving Myocardial Infarction Prediction in Young Individuals in India",
      publisher: "IEEE",
      year: "2026",
      // TODO: Add the full conference name.
      venue: "2026 5th International Conference on Computer Networks, Big Data and IoT (ICCBI)",
      authorship: "Third author",
      url: "https://ieeexplore.ieee.org/abstract/document/11619602",
    },
    hackathons: {
      // TODO: Fill in [N].
      summary:
        "Participated in 15+ hackathons including Amazon, Tejas (corporate CSR hackathon hosted at our college), Smart India Hackathon (twice), Loreal, ISRO and college hackathons, with prizes won.",
    },
    certificates: {
      // How many show before "Show all".
      initial: 6,
      // Sorted by relevance to SWE / AI / fintech roles. TODO: add each certificate's URL.
      items: [
        { title: "Google Cybersecurity Professional Certificate", issuer: "Google, via Coursera", note: "", image: "assets/gcs.jpeg", url: "" },
        { title: "Practical Cyber Security for Cyber Security Practitioners", issuer: "NPTEL", note: "Top 1%", image: "assets/nptel-cyber.jpg", url: "" },
        { title: "Open Source LLMOps Solutions", issuer: "Duke University, via Coursera", note: "", image: "assets/duke.jpg", url: "" },
        { title: "Machine Learning with Python", issuer: "freeCodeCamp", note: "", image: "assets/fcc.png", url: "" },
        { title: "Software Engineering Job Simulation", issuer: "JPMorgan Chase, via Forage", note: "", image: "assets/jpmc.jpg", url: "" },
        { title: "Cybersecurity Analyst Job Simulation", issuer: "TATA, via Forage", note: "", image: "assets/tata.jpeg", url: "" },
        { title: "Quantum Computing", issuer: "NPTEL", note: "", image: "assets/nptel-quantum.jpg", url: "" },
        { title: "GeeksforGeeks TensorFlow", issuer: "GeeksforGeeks", note: "", image: "assets/gfg.jpeg", url: "" },
        { title: "Business Fundamentals for Entrepreneurs", issuer: "NPTEL", note: "", image: "assets/nptel-business.jpg", url: "" },
        { title: "India-Taiwan Conference on Semiconductor Packaging & testing", issuer: "LUNGHWA University and SASTRA Deemed University", note: "Attendance", image: "assets/conference.jpg", url: "" },
        { title: "Volunteering, event anchoring and public speaking", issuer: "TEMENOS", note: "", image: "assets/tejas.jpg", url: "" },
      ],
    },
  },

  // Small section after Recognition. Not in the nav on purpose.
  beyond: {
    label: "Beyond CS",
    heading: "Nanotechnology minor",
    // TODO: Edit the last sentence.
    body:
      "Alongside CSE I take a minor in Nanotechnology, which is where my interest in semiconductors started. I attended the India-Taiwan semiconductor conference held by LUNGHWA University and SASTRA University.",
  },

  about: {
    label: "About",
    heading: "In brief",
    // TODO: Edit to sound like you. 3 to 4 short sentences.
    paragraphs: [
      "I study Computer Science at SASTRA Deemed University and graduate in 2027, with a minor in Nanotechnology.",
      "Most of my work sits between machine learning and backend engineering: training and explaining models, then building the services and tests around them.",
      "This summer I interned at Fidelity Investments on a Spring Boot service and its unit, BDD and API tests.",
      "I wish to work on more diverse domains in the future.",
    ],
    // TODO: Replace with a second photo (4:5), or reuse the hero photo.
    photo: {
      src: "assets/photo-about.jpg",
      alt: "Satvika Gada",
      width: 800,
      height: 1000,
    },
    howIWorkHeading: "How I work",
    // TODO: Check these match how you work. Max 3.
    howIWork: [
      {
        title: "Tests are part of the feature",
        body: "At Fidelity I wrote unit, Cucumber and Karate tests alongside the code. I keep that habit on my own projects. [Edit or replace.]",
      },
      {
        title: "Explain the model, not just the score",
        body: "The IEEE paper I co-wrote used SHAP to show which features drove each prediction. I run the same check on my own models. [Edit or replace.]",
      },
      {
        title: "Draw the Workflow first",
        body: "I draw the entire workflow of the project on paper for better understanding.",
      },
    ],
    // TODO: Fill in.
    interests: "Outside work: Reading books of diverse genre, Watching movies and series, Enjoy global politics.",
  },

  contact: {
    label: "Contact",
    heading: "Get in touch.",
    // TODO: Fill in your availability.
    line: "Email is the fastest way to reach me. I am open to internships and full-time roles.",
    form: {
      // TODO: Pick how the form sends messages.
      //   "formspree": create a form at formspree.io and paste its URL as endpoint,
      //                e.g. "https://formspree.io/f/abcdwxyz".
      //   "netlify":   deploy on Netlify; leave endpoint as "/" (the form is already marked up for it).
      //   "mailto":    no backend; the visitor's email app opens with the message filled in.
      // If provider is "formspree" and endpoint is empty, the form falls back to mailto.
      provider: "formspree",
      endpoint: "https://formspree.io/f/xrpqedre",
    },
  },

  footer: {
    note: "Built by hand with HTML, CSS and JavaScript.",
  },
};
