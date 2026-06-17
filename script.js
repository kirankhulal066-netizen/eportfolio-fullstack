/**
 * ================================================================
 *   DEVELOPER ePORTFOLIO JAVASCRIPT
 *   Description: Interactivity logic for demos, playground tools, and layout.
 *   Author: Junior Full Stack Developer (Graduate)
 * ================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Initialize All Core Modules ---
  initThemeToggle();
  initTypingAnimation();
  initFullStackSimulation();
  initHtmlPlayground();
  initCssVisualizer();
  initJsHub();
  initContactValidation();
});

/* ==========================================
   1. GLOBAL THEME TOGGLE (DARK / LIGHT)
   ========================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  // Check for saved user preference, otherwise default to lucid (light)
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.checked = savedTheme === "light";

  themeToggle.addEventListener("change", (e) => {
    const isLight = e.target.checked;
    const currentTheme = isLight ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    
    // Dispatch custom event for parts of script that need to adapt (like DOM Playground colors)
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: currentTheme } }));
  });
}

/* ==========================================
   2. HERO TYPING ANIMATION
   ========================================== */
function initTypingAnimation() {
  const typedSpan = document.querySelector(".typed-text");
  if (!typedSpan) return;

  const roles = ["Junior Full Stack Developer", "Problem Solver", "Continuous Learner", "UI/UX Enthusiast"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting text
      typedSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Delete faster
    } else {
      // Writing text
      typedSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Natural typing speed
    }

    // Checking bounds
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at the end of typing
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing loop
  setTimeout(type, 1000);
}

/* ==========================================
   3. WHAT IS FULL STACK? SIMULATION
   ========================================== */
function initFullStackSimulation() {
  const simulateBtn = document.getElementById("simulateApiBtn");
  const packet = document.getElementById("flowPacket");
  const nodes = {
    frontend: document.getElementById("nodeFrontend"),
    backend: document.getElementById("nodeBackend"),
    database: document.getElementById("nodeDatabase")
  };
  const terminal = document.getElementById("simTerminal");

  if (!simulateBtn || !packet || !terminal) return;

  let isRunning = false;

  // Predefined terminal log entries
  function log(message, type = "info") {
    const p = document.createElement("p");
    p.className = "mb-1";
    let prefix = "[System]";
    if (type === "req") prefix = ">> [Request]";
    if (type === "db") prefix = "== [Database]";
    if (type === "res") prefix = "<< [Response]";
    
    p.innerHTML = `<span class="text-muted">${prefix}</span> ${message}`;
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
  }

  simulateBtn.addEventListener("click", () => {
    if (isRunning) return;
    isRunning = true;
    simulateBtn.disabled = true;
    terminal.innerHTML = ""; // Clear console

    log("Initializing simulation...", "info");

    // Phase 1: Frontend triggers request
    setTimeout(() => {
      nodes.frontend.classList.add("active");
      log("Client user clicks 'View Portfolio Profiles'", "req");
      log("Frontend triggers HTTP request: GET /api/graduates/1", "req");
      
      // Position packet at Frontend Node and show it
      packet.style.display = "block";
      packet.style.left = "10%";
      packet.style.transition = "left 1.2s ease-in-out";
      
      // Animate packet to Backend Node (centered at ~50%)
      setTimeout(() => {
        packet.style.left = "50%";
      }, 50);
    }, 500);

    // Phase 2: Backend receives and processes
    setTimeout(() => {
      nodes.frontend.classList.remove("active");
      nodes.backend.classList.add("active");
      log("Express.js API Router matches route GET /api/graduates/:id", "info");
      log("Backend controller processes user payload parameters", "info");
      log("SQL Query builder dispatched to PostgreSQL client...", "info");
      
      // Animate packet from Backend (50%) to Database (90%)
      packet.style.left = "90%";
    }, 1800);

    // Phase 3: Database executes queries
    setTimeout(() => {
      nodes.backend.classList.remove("active");
      nodes.database.classList.add("active");
      log("Query executing: SELECT * FROM grads WHERE id = 1;", "db");
      log("Database matches record: { name: 'Alex Dev', role: 'Full Stack Jr' }", "db");
      log("Query response returning database payload (240ms)", "db");
      
      // Return packet database (90%) to backend (50%)
      packet.style.left = "50%";
    }, 3100);

    // Phase 4: Backend receives DB data, formats response, and sends it back
    setTimeout(() => {
      nodes.database.classList.remove("active");
      nodes.backend.classList.add("active");
      log("Backend formats SQL result into HTTP response JSON structure", "info");
      log("Sending HTTP Status 200 OK with payload headers", "res");
      
      // Return packet backend (50%) to frontend (10%)
      packet.style.left = "10%";
    }, 4400);

    // Phase 5: Frontend renders data dynamically
    setTimeout(() => {
      nodes.backend.classList.remove("active");
      nodes.frontend.classList.add("active");
      log("Frontend JavaScript resolves promise and parsing Response Body JSON", "res");
      log("DOM updated: Hello, Alex Dev renders successfully in browser view!", "res");
      
      // Hide packet
      packet.style.display = "none";
      
      // Add fake response content block in terminal
      const responseBlock = document.createElement("pre");
      responseBlock.className = "text-info p-2 mt-2 border rounded border-secondary";
      responseBlock.style.backgroundColor = "rgba(0,0,0,0.3)";
      responseBlock.textContent = JSON.stringify({
        status: 200,
        data: {
          id: 1,
          name: "Alex Dev",
          role: "Junior Full Stack Developer",
          skills: ["HTML", "CSS", "Bootstrap", "JavaScript", "Node.js", "Express", "SQL"],
          message: "Database communication fully validated!"
        }
      }, null, 2);
      terminal.appendChild(responseBlock);
      terminal.scrollTop = terminal.scrollHeight;
    }, 5700);

    // End simulation
    setTimeout(() => {
      nodes.frontend.classList.remove("active");
      simulateBtn.disabled = false;
      isRunning = false;
    }, 6500);
  });
}

/* ==========================================
   4. HTML PLAYGROUND
   ========================================== */
const HTML_SNIPPETS = {
  headings: {
    code: `<!-- Heading & Paragraph Examples -->
<div class="p-3 bg-light border rounded">
  <h1 class="text-primary">Heading Level 1</h1>
  <p class="lead">Paragraphs can have helper classes like "lead" to make text appear larger and easier to scan.</p>
  
  <h2>Sub-Heading Level 2</h2>
  <p>Every page should have a clear hierarchy. Utilize headings to group details and enhance user layouts.</p>
  
  <p class="text-muted">You can also mute paragraphs to signify low importance info.</p>
</div>`,
    explanation: "HTML utilizes headings (h1 to h6) to define semantic content structures. Paragraph tags (p) encapsulate main descriptive texts. Here, we also leverage Bootstrap helper classes like `text-primary` and `lead` to quickly style them."
  },
  forms: {
    code: `<!-- Form Sample Structure -->
<form onsubmit="event.preventDefault(); alert('Form submitted successfully!');">
  <div class="mb-3">
    <label for="devName" class="form-label">Full Name</label>
    <input type="text" id="devName" class="form-control" placeholder="Jane Doe" required>
  </div>
  <div class="mb-3">
    <label for="devMail" class="form-label">Email Address</label>
    <input type="email" id="devMail" class="form-control" placeholder="jane@domain.com" required>
    <div class="form-text">We'll never share your email.</div>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="devCheck" required>
    <label class="form-check-label" for="devCheck">Agree to terms & conditions</label>
  </div>
  <button type="submit" class="btn btn-primary w-100">Submit Application</button>
</form>`,
    explanation: "Forms (form) require inputs, labels, and form controls. The label tag connects directly with standard inputs using the `for` and `id` properties, which is essential for accessibility and screen reader capabilities."
  },
  tables: {
    code: `<!-- Table Example -->
<div class="table-responsive">
  <table class="table table-bordered table-striped table-hover align-middle">
    <thead class="table-dark">
      <tr>
        <th scope="col">Skill Group</th>
        <th scope="col">Technologies</th>
        <th scope="col">Competency Level</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Frontend</th>
        <td>HTML, CSS, JavaScript, Bootstrap</td>
        <td><span class="badge bg-success">Advanced</span></td>
      </tr>
      <tr>
        <th scope="row">Backend</th>
        <td>Node.js, Express, REST APIs</td>
        <td><span class="badge bg-warning text-dark">Intermediate</span></td>
      </tr>
      <tr>
        <th scope="row">Database</th>
        <td>PostgreSQL, MongoDB, SQL queries</td>
        <td><span class="badge bg-info text-dark">Learner</span></td>
      </tr>
    </tbody>
  </table>
</div>`,
    explanation: "Tables require proper tags: `thead` for header columns, `tbody` for content rows, `tr` for row items, `th` for structural labels, and `td` for standard cell values. Responsive containers prevent tables from stretching mobile layouts."
  },
  semantic: {
    code: `<!-- Semantic Layout Blocks -->
<article class="p-3 border border-indigo rounded">
  <header class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
    <h3 class="h5 mb-0 text-dark">Understanding Semantic HTML</h3>
    <span class="badge bg-info text-dark">HTML5</span>
  </header>
  <section class="mb-3">
    <p>Semantic tags identify the meaning of the content enclosed. Unlike generic layout containers (like div), standard tags clearly instruct scrapers and engines on page layout semantics.</p>
  </section>
  <footer class="text-muted fs-7">
    <span>Author: Junior Developer</span> • <span>Published: May 2026</span>
  </footer>
</article>`,
    explanation: "Semantic tags (`article`, `section`, `header`, `footer`) specify content structures to browsers and search engine crawlers. Standard semantic coding replaces meaningless divs with structural anchors, improving SEO and readability."
  }
};

function initHtmlPlayground() {
  const tabs = document.querySelectorAll(".playground-tab-btn");
  const codePre = document.getElementById("playgroundCode");
  const previewDiv = document.getElementById("playgroundPreview");
  const explanationDiv = document.getElementById("playgroundExplanationText");

  if (!codePre || !previewDiv || !explanationDiv) return;

  function loadSnippet(key) {
    const data = HTML_SNIPPETS[key];
    if (!data) return;

    // Set code inside editor display (simple syntax styling can just show code text)
    codePre.textContent = data.code;
    
    // Set explanation details
    explanationDiv.innerHTML = data.explanation;
    
    // Render the code live inside the preview pane
    previewDiv.innerHTML = data.code;
  }

  // Set default snippet
  loadSnippet("headings");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Toggle active states
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Load matching data
      const category = tab.getAttribute("data-snippet");
      loadSnippet(category);
    });
  });
}

/* ==========================================
   5. CSS VISUALIZER (FLEXBOX / GRID & COMPARISON)
   ========================================== */
function initCssVisualizer() {
  const flexContainer = document.getElementById("flexVisualContainer");
  const gridContainer = document.getElementById("gridVisualContainer");
  
  const flexControls = {
    dir: document.getElementById("flexDirSelect"),
    justify: document.getElementById("flexJustifySelect"),
    align: document.getElementById("flexAlignSelect")
  };

  const gridControls = {
    cols: document.getElementById("gridColsSelect"),
    gap: document.getElementById("gridGapSelect")
  };

  // Check if components exist
  if (!flexContainer || !gridContainer) return;

  // Flex Event Handlers
  if (flexControls.dir && flexControls.justify && flexControls.align) {
    const updateFlex = () => {
      flexContainer.style.flexDirection = flexControls.dir.value;
      flexContainer.style.justifyContent = flexControls.justify.value;
      flexContainer.style.alignItems = flexControls.align.value;
    };

    flexControls.dir.addEventListener("change", updateFlex);
    flexControls.justify.addEventListener("change", updateFlex);
    flexControls.align.addEventListener("change", updateFlex);
  }

  // Grid Event Handlers
  if (gridControls.cols && gridControls.gap) {
    const updateGrid = () => {
      gridContainer.style.gridTemplateColumns = `repeat(${gridControls.cols.value}, 1fr)`;
      gridContainer.style.gap = gridControls.gap.value;
    };

    gridControls.cols.addEventListener("change", updateGrid);
    gridControls.gap.addEventListener("change", updateGrid);
  }
}

/* ==========================================
   6. JAVASCRIPT HUB WIDGETS
   ========================================== */
function initJsHub() {
  initCalculator();
  initTodo();
  initDomPlayground();
  initRealtimeValidation();
}

// 6.1 Calculator Widget
function initCalculator() {
  const display = document.getElementById("calcDisplay");
  const buttons = document.querySelectorAll(".calc-btn");
  if (!display || !buttons) return;

  let buffer = "";

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-val");

      if (val === "C") {
        buffer = "";
        display.textContent = "0";
      } else if (val === "=") {
        if (!buffer) return;
        try {
          // Replace operators for execution safety or use custom basic parser
          // For simplicity and beginner code, using basic eval check with sanitized characters
          const cleanBuffer = buffer.replace(/[^0-9+\-*/.]/g, '');
          const result = Function(`"use strict"; return (${cleanBuffer})`)();
          buffer = String(result);
          display.textContent = buffer;
        } catch (e) {
          display.textContent = "Error";
          buffer = "";
        }
      } else {
        // Prevent typing multiple consecutive operators
        if (["+", "-", "*", "/"].includes(val) && ["+", "-", "*", "/"].includes(buffer.slice(-1))) {
          return;
        }
        
        if (display.textContent === "0" && !["+", "-", "*", "/"].includes(val)) {
          buffer = val;
        } else {
          buffer += val;
        }
        display.textContent = buffer;
      }
    });
  });
}

// 6.2 To-Do List Widget
function initTodo() {
  const input = document.getElementById("todoInput");
  const addBtn = document.getElementById("addTodoBtn");
  const list = document.getElementById("todoList");
  if (!input || !addBtn || !list) return;

  // Local state Array
  let tasks = [
    { text: "Learn HTML & CSS Foundations", completed: true },
    { text: "Build dynamic client applications", completed: false }
  ];

  function renderTasks() {
    list.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "todo-item";
      
      li.innerHTML = `
        <div class="form-check d-flex align-items-center">
          <input class="form-check-input me-2 todo-check" type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
          <span class="todo-text ${task.completed ? "completed" : ""}">${task.text}</span>
        </div>
        <button class="todo-delete-btn" data-index="${index}">
          <i class="bi bi-trash-fill"></i>
        </button>
      `;
      
      list.appendChild(li);
    });

    // Add listeners to actions
    document.querySelectorAll(".todo-check").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const idx = e.target.getAttribute("data-index");
        tasks[idx].completed = e.target.checked;
        renderTasks();
      });
    });

    document.querySelectorAll(".todo-delete-btn").forEach(del => {
      del.addEventListener("click", (e) => {
        // Handle icon click targeting target index
        const btn = e.currentTarget;
        const idx = btn.getAttribute("data-index");
        tasks.splice(idx, 1);
        renderTasks();
      });
    });
  }

  // Add Task
  addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    input.value = "";
    renderTasks();
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  // Render initial tasks
  renderTasks();
}

// 6.3 Dynamic DOM Particle Playground
function initDomPlayground() {
  const container = document.getElementById("domSandbox");
  const spawnBtn = document.getElementById("spawnElementBtn");
  const clearBtn = document.getElementById("clearElementsBtn");
  if (!container || !spawnBtn || !clearBtn) return;

  spawnBtn.addEventListener("click", () => {
    // Generate particle variables
    const size = Math.floor(Math.random() * 40) + 15; // 15px to 55px
    const posX = Math.floor(Math.random() * (container.clientWidth - size));
    const posY = container.clientHeight - size - 10;
    
    // Choose dynamic color based on active theme
    const theme = document.documentElement.getAttribute("data-theme");
    const colors = theme === "light" 
      ? ["#4f46e5", "#0891b2", "#8b5cf6", "#10b981", "#f59e0b"]
      : ["#818cf8", "#22d3ee", "#c084fc", "#34d399", "#fbbf24"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const particle = document.createElement("div");
    particle.className = "dom-particle";
    
    // Position and style the new particle element
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 15px ${color}`;
    
    // Add text tag for fun developer detail
    const techTags = ["DOM", "DIV", "CSS", "API", "JS", "VAR", "HTML"];
    particle.style.display = "flex";
    particle.style.alignItems = "center";
    particle.style.justifyContent = "center";
    particle.style.color = "#ffffff";
    particle.style.fontSize = `${size * 0.3}px`;
    particle.style.fontWeight = "bold";
    particle.textContent = techTags[Math.floor(Math.random() * techTags.length)];

    // Randomize movement vector x for animation keyframes
    const moveX = (Math.random() * 100 - 50) + "px";
    particle.style.setProperty("--move-x", moveX);

    // Append element dynamically (Dynamic DOM Manipulation)
    container.appendChild(particle);

    // Auto-clean particle element after animation runs (4 seconds)
    setTimeout(() => {
      if (particle.parentNode === container) {
        container.removeChild(particle);
      }
    }, 4000);
  });

  clearBtn.addEventListener("click", () => {
    container.innerHTML = "";
  });
}

// 6.4 Real-time Form Strength Checker
function initRealtimeValidation() {
  const username = document.getElementById("valUser");
  const email = document.getElementById("valEmail");
  const password = document.getElementById("valPass");
  const strengthFill = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthText");
  const submitBtn = document.getElementById("regSubmitBtn");
  
  if (!username || !email || !password || !submitBtn) return;

  function validateEmail(addr) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(addr).toLowerCase());
  }

  function getPasswordStrength(val) {
    let score = 0;
    if (!val) return 0;
    if (val.length >= 6) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;
    return score;
  }

  function updateFormState() {
    const userValid = username.value.trim().length >= 3;
    const emailValid = validateEmail(email.value.trim());
    const passStrength = getPasswordStrength(password.value);
    
    // Check validation states
    if (userValid) {
      username.classList.remove("is-invalid");
      username.classList.add("is-valid");
    } else {
      username.classList.remove("is-valid");
      if (username.value) username.classList.add("is-invalid");
    }

    if (emailValid) {
      email.classList.remove("is-invalid");
      email.classList.add("is-valid");
    } else {
      email.classList.remove("is-valid");
      if (email.value) email.classList.add("is-invalid");
    }

    // Password check update
    strengthFill.className = "pw-strength-fill";
    if (passStrength === 0) {
      strengthFill.style.width = "0%";
      strengthLabel.textContent = "Requirement: min 6 chars, uppercase & number";
      strengthLabel.className = "form-text text-muted";
      password.classList.remove("is-valid", "is-invalid");
    } else if (passStrength === 1) {
      strengthFill.classList.add("strength-weak");
      strengthLabel.textContent = "Weak Password";
      strengthLabel.className = "form-text text-danger";
      password.classList.add("is-invalid");
    } else if (passStrength === 2) {
      strengthFill.classList.add("strength-medium");
      strengthLabel.textContent = "Medium Strength";
      strengthLabel.className = "form-text text-warning";
      password.classList.remove("is-invalid");
    } else if (passStrength === 3) {
      strengthFill.classList.add("strength-strong");
      strengthLabel.textContent = "Strong Password!";
      strengthLabel.className = "form-text text-success";
      password.classList.remove("is-invalid");
      password.classList.add("is-valid");
    }

    // Enable/Disable Register Button
    if (userValid && emailValid && passStrength >= 2) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  // Attach dynamic keyup validation listeners
  username.addEventListener("input", updateFormState);
  email.addEventListener("input", updateFormState);
  password.addEventListener("input", updateFormState);

  // Form submission handler
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert(`Account Simulation Success!\nUser: ${username.value}\nEmail: ${email.value}`);
    username.value = "";
    email.value = "";
    password.value = "";
    username.classList.remove("is-valid");
    email.classList.remove("is-valid");
    password.classList.remove("is-valid");
    strengthFill.style.width = "0%";
    strengthLabel.textContent = "";
    submitBtn.disabled = true;
  });
}

/* ==========================================
   7. CONTACT FORM VALIDATION
   ========================================== */
function initContactValidation() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const message = document.getElementById("contactMessage");

    let valid = true;

    // Simple Name Validator
    if (!name.value.trim()) {
      name.classList.add("is-invalid");
      valid = false;
    } else {
      name.classList.remove("is-invalid");
      name.classList.add("is-valid");
    }

    // Simple Email Validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.classList.add("is-invalid");
      valid = false;
    } else {
      email.classList.remove("is-invalid");
      email.classList.add("is-valid");
    }

    // Message Validator
    if (message.value.trim().length < 10) {
      message.classList.add("is-invalid");
      valid = false;
    } else {
      message.classList.remove("is-invalid");
      message.classList.add("is-valid");
    }

    if (valid) {
      // Simulate success modal or prompt alert
      alert(`Thank you, ${name.value}! Your message has been sent successfully.`);
      contactForm.reset();
      name.classList.remove("is-valid");
      email.classList.remove("is-valid");
      message.classList.remove("is-valid");
    }
  });
}
