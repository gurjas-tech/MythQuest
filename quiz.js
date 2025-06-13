let questions = [];
let currentIndex = 0;
let correctAnswers = 0;

// Shuffle function to randomize questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

window.onload = async () => {
  const res = await fetch("quiz.json");
  questions = await res.json();
  shuffle(questions); // Randomize question order
  showQuestion();
};

function showQuestion() {
  const q = questions[currentIndex];

  document.getElementById("question").classList.remove("hidden");
  document.getElementById("question").textContent = `MythQuest: ${q.question}`;

  // Show correct count at the bottom
  document.getElementById(
    "progress"
  ).textContent = `Correct: ${correctAnswers} / 5`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className =
      "answer w-full p-3 rounded-xl text-left shadow transition bg-white hover:bg-gray-100 border";
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("result").classList.add("hidden");
  document.getElementById("next").classList.add("hidden");

  const sparkle = document.getElementById("diamond");
  if (sparkle) sparkle.remove();
}

function checkAnswer(selected) {
  const q = questions[currentIndex];
  const result = document.getElementById("result");
  const buttons = document.querySelectorAll(".answer");

  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === q.answer) {
      btn.classList.add("bg-green-300", "text-white", "font-bold");
    } else if (btn.textContent === selected) {
      btn.classList.add("bg-red-300", "text-white", "font-bold");
    }
  });

  if (selected === q.answer) {
    correctAnswers++;

    // Update correct counter
    document.getElementById(
      "progress"
    ).textContent = `Correct: ${correctAnswers} / 5`;

    result.textContent = q.explanation;
    result.className = "text-green-600 text-xl text-center font-semibold mt-4";

    // 💎 Diamond effect
    const diamond = document.createElement("img");
    diamond.src = "diamond.png"; // Replace with your image path
    diamond.id = "diamond";
    diamond.alt = "Diamond";
    diamond.className =
      "fixed top-1/2 left-1/2 w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 animate-pop z-50 pointer-events-none";
    document.body.appendChild(diamond);

    setTimeout(() => {
      diamond.remove();
    }, 1200);
  } else {
    result.textContent = `❌ Not quite. That myth was made up.\nCorrect Answer: ${q.answer}`;
    result.className = "text-red-600 text-xl text-center font-semibold mt-4";
  }

  result.classList.remove("hidden");
  document.getElementById("next").classList.remove("hidden");
}

function nextQuestion() {
  currentIndex++;
  const result = document.getElementById("result");
  const nextBtn = document.getElementById("next");

  if (correctAnswers >= 5) {
    window.location.href = "congratualtions.html";
    return;
  }

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById("question").textContent =
      "🎉 You've completed the game!";
    document.getElementById("options").innerHTML = "";
    nextBtn.classList.add("hidden");
    result.textContent = "Thanks for learning about Indigenous myths!";
    result.className = "text-blue-700 text-xl text-center font-semibold mt-4";
    result.classList.remove("hidden");
  }
}
