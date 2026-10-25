(() => {
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          entry.target.querySelectorAll(".bar > span").forEach((bar) => {
            bar.style.width = bar.dataset.width || "0";
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
    document.querySelectorAll(".bar > span").forEach((bar) => {
      bar.style.width = bar.dataset.width || "0";
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  initializeWordScramble();

  function initializeWordScramble() {
    const game = document.getElementById("word-scramble");
    if (!game) return;

    const words = ["teacher", "student", "classroom", "pencil", "lesson", "friend", "school", "learn"];
    const scrambledWord = document.getElementById("scrambled-word");
    const progress = document.getElementById("scramble-progress");
    const form = document.getElementById("scramble-form");
    const answer = document.getElementById("scramble-answer");
    const feedback = document.getElementById("scramble-feedback");
    const scoreDisplay = document.getElementById("scramble-score");
    const checkButton = document.getElementById("check-answer");
    const nextButton = document.getElementById("next-word");
    const resetButton = document.getElementById("reset-scramble");

    const state = {
      deck: [],
      index: 0,
      score: 0,
      answered: false,
    };

    function shuffled(items) {
      const result = [...items];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
      }
      return result;
    }

    function scramble(word) {
      const letters = [...word];
      let mixed = word;

      for (let attempt = 0; attempt < 12 && mixed === word; attempt += 1) {
        for (let index = letters.length - 1; index > 0; index -= 1) {
          const swapIndex = Math.floor(Math.random() * (index + 1));
          [letters[index], letters[swapIndex]] = [letters[swapIndex], letters[index]];
        }
        mixed = letters.join("");
      }

      return mixed === word ? `${word.slice(1)}${word[0]}` : mixed;
    }

    function showQuestion() {
      const word = state.deck[state.index];
      if (!word) return showResults();

      state.answered = false;
      progress.textContent = `WORD ${state.index + 1} OF ${state.deck.length}`;
      scrambledWord.replaceChildren(
        ...[...scramble(word)].map((letter) => {
          const tile = document.createElement("span");
          tile.className = "mono flex h-11 min-w-9 items-center justify-center rounded-lg border border-neon/20 bg-neon/[.06] px-2 text-lg font-medium text-neon";
          tile.textContent = letter.toUpperCase();
          return tile;
        })
      );

      answer.value = "";
      answer.disabled = false;
      checkButton.disabled = false;
      nextButton.classList.add("hidden");
      nextButton.textContent = "Next word →";
      resetButton.textContent = "↻ Start over";
      feedback.textContent = "Type your guess, then check your answer.";
      feedback.className = "mt-4 min-h-6 text-sm text-white/50";
    }

    function showResults() {
      state.answered = true;
      progress.textContent = "ROUND COMPLETE";
      scrambledWord.replaceChildren();
      answer.value = "";
      answer.disabled = true;
      checkButton.disabled = true;
      nextButton.classList.add("hidden");
      resetButton.textContent = "↻ Play again";
      feedback.textContent = `You got ${state.score} of ${state.deck.length} correct. Play again for a new word order.`;
      feedback.className = "mt-4 min-h-6 text-sm text-neon";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (state.answered) return;

      const guess = answer.value.trim().toLocaleLowerCase();
      if (!guess) {
        feedback.textContent = "Enter a guess first.";
        feedback.className = "mt-4 min-h-6 text-sm text-amber-300";
        answer.focus();
        return;
      }

      const word = state.deck[state.index];
      if (guess !== word) {
        feedback.textContent = "Not quite. Give it another try.";
        feedback.className = "mt-4 min-h-6 text-sm text-amber-300";
        answer.select();
        return;
      }

      state.score += 1;
      state.answered = true;
      scoreDisplay.textContent = String(state.score);
      answer.disabled = true;
      checkButton.disabled = true;
      feedback.textContent = `Correct! The word is ${word}.`;
      feedback.className = "mt-4 min-h-6 text-sm text-neon";
      nextButton.textContent = state.index === state.deck.length - 1 ? "See results →" : "Next word →";
      nextButton.classList.remove("hidden");
      nextButton.focus();
    });

    nextButton.addEventListener("click", () => {
      if (!state.answered) return;

      if (state.index === state.deck.length - 1) {
        showResults();
        return;
      }

      state.index += 1;
      showQuestion();
      answer.focus({ preventScroll: true });
    });

    resetButton.addEventListener("click", () => {
      state.deck = shuffled(words);
      state.index = 0;
      state.score = 0;
      scoreDisplay.textContent = "0";
      showQuestion();
      answer.focus({ preventScroll: true });
    });

    state.deck = shuffled(words);
    showQuestion();
  }
})();
