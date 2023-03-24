const permutationWithRepeat = (symbols, r, maxResult = 39916800) => {
  const n = symbols.length;

  if (r < 1)
    return [];

  const paths = [], path = [];

  const dfs = () => {
    if (path.length === r && (maxResult <= 0 || paths.length < maxResult)) {
      paths.push(path.join(""));
      return null;
    }

    if (maxResult <= 0 || paths.length < maxResult) {
      for (let i = 0; i < n; i += 1) {
        path.push(symbols[i]);
        dfs();
        path.pop();
      }
    }
  }

  dfs();
  return paths;
}

const permutationWithOutRepeat = (symbols, r, maxResult = 39916800) => {
  const n = symbols.length;

  if (r > n || r < 1)
    return [];

  const paths = [], path = [], taken = new Array(n).fill(false);

  const dfs = () => {
    if (path.length === r && (maxResult <= 0 || paths.length < maxResult)) {
      paths.push(path.join(""));
      return null;
    }
    if (maxResult <= 0 || paths.length < maxResult) {
      for (let i = 0; i < n; i += 1) {
        if (taken[i] === false) {
          path.push(symbols[i]);
          taken[i] = true;
          dfs();
          path.pop();
          taken[i] = false;
        }
      }
    }
  }

  dfs();
  return paths;
}

const combinationWithRepeat = (symbols, r, maxResult = 39916800) => {

  const n = symbols.length;

  if (r < 1)
    return [];

  const paths = [], path = [];


  const dfs = (index) => {

    if (path.length === r && (maxResult <= 0 || paths.length < maxResult)) {
      paths.push(path.join(""));
      return null;
    }

    if (maxResult <= 0 || paths.length < maxResult) {

      for (let i = index; i < n; i += 1) {
        path.push(symbols[i]);
        dfs(i);
        path.pop();
      }
    }
  }

  dfs(0);

  return paths;
}

const combinationWithOutRepeat = (symbols, r, maxResult = 39916800) => {
  const n = symbols.length;

  if (r > n || r < 1)
    return [];

  const paths = [], path = [];

  const dfs = (index) => {

    if (path.length === r && (maxResult <= 0 || paths.length < maxResult)) {
      paths.push(path.join(""));
      return null;
    }
    if (maxResult <= 0 || paths.length < maxResult) {
      for (let i = index + 1; i < n; i += 1) {
        path.push(symbols[i]);
        dfs(i);
        path.pop();
      }
    }
  }

  dfs(-1);
  return paths;
}

const cMul = (a, b) => {
  let res = a, i = a + 1n;

  while (i <= b) {
    res *= i;
    i += 1n;
  }
  return res;
}

const execData = {
  pr: { exec: permutationWithRepeat, calc: (n, r) => BigInt(n) ** BigInt(r) },
  pnr: {
    exec: permutationWithOutRepeat, calc: (n, r) => {
      n = BigInt(n);
      r = BigInt(r);

      return cMul(n - r + 1n, n);
    }
  },
  cr: {
    exec: combinationWithRepeat, calc: (n, r) => {
      n = BigInt(n);
      r = BigInt(r);

      return cMul(n, n + r - 1n) / cMul(1n, r);
    }
  },
  cnr: {
    exec: combinationWithOutRepeat, calc: (n, r) => {
      n = BigInt(n);
      r = BigInt(r);

      return cMul(n - r + 1n, n) / cMul(1n, r);
    }
  }
}

const main = () => {

  const radios = document.querySelectorAll("#radioDiv input");
  const genBtn = document.getElementById("gen");
  const downloadBtn = document.getElementById("download");

  const rinp = document.getElementById("rinp");
  const symbolsInp = document.getElementById("symbolsInp");

  const resDiv = document.getElementById("resDiv");

  const symNum = document.getElementById("symNum");
  const pcNum = document.getElementById("pcNum");

  const addText = (text) => {
    tpara = document.createElement("p");
    tpara.textContent = text;
    resDiv.appendChild(tpara);
  }

  const inpTweak = (tval) => {
    for (let i = 0; i < radios.length; i += 1) {
      radios[i].disabled = tval;
    }
  }

  genBtn.disabled = true;
  downloadBtn.disabled = true;

  let timeoutId = -1, tpara = document.createElement("p");

  inpTweak(true);

  let symbols = [], rval = 0, execid = "", paths = [];

  const dllink = document.createElement("a");

  const inpCheck = (inpsymbols, inprval) => {
    if (!inpsymbols || !inprval) {
      symNum.textContent = "";
      pcNum.textContent = "";
      symbols = [];
      rval = 0;
      inpTweak(true);
      genBtn.disabled = true;
      downloadBtn.disabled = true;
      return;
    }


    inpsymbols = inpsymbols.replaceAll("\n", " ").split(" ").filter((n) => n !== "");
    inpsymbols = Array.from(new Set(inpsymbols));
    inprval = Number(inprval);
    symbols = inpsymbols;
    rval = inprval;

    symNum.textContent = inpsymbols.length;

    if (inprval <= inpsymbols.length) {
      inpTweak(false);
    }

    else {
      radios[0].disabled = false;
      radios[2].disabled = false;

      radios[1].disabled = true;
      radios[3].disabled = true;
    }
  }

  const inputHandler = (e) => {
    //console.log("tid", timeoutId)

    if (timeoutId !== -1)
      clearTimeout(timeoutId);
    timeoutId = setTimeout(inpCheck, 800, symbolsInp.value, rinp.value);
  }

  const radioHandler = (e) => {
    const id = e.target.id;

    const ttext = (id[0] === "p") ? "Permutations : " : "Combinations : ";

    pcNum.textContent = ttext + execData[id].calc(symbols.length, rval).toLocaleString("en-US");

    genBtn.disabled = false;

    downloadBtn.disabled = true;

    execid = id;
  }

  const buttonHandler = () => {
    const maxRes = Number(document.getElementById("resNumInp").value);

    resDiv.innerHTML = "";
    genBtn.textContent = "Generating...";
    genBtn.disabled = true;

    const execfun = () => {

      paths = execData[execid].exec(symbols, rval, maxRes);

      if (paths.length > 10_000) {
        addText("Result list is very long unable to show it all");
        addText("Click the download button to download all results");
        addText("Showing Partial Result List");
      }
      const lv = Math.min(10_000, paths.length);

      for (let i = 0; i < lv; i += 1) {
        addText(paths[i]);
      }
      genBtn.textContent = "Generate";
      genBtn.disabled = false;
      downloadBtn.disabled = false;

    };

    setTimeout(execfun, 700);

  }

  const downloadHandler = () => {

    downloadBtn.textContent = "Downloading...";
    downloadBtn.disabled = true;

    const blobDl = () => {

      dllink.href = window.URL.createObjectURL(
        new Blob([paths.join("\n")], { type: "text/plain" })
      );

      dllink.download = "res.txt";

      dllink.click();

      downloadBtn.textContent = "Download";
      downloadBtn.disabled = false;
    }

    setTimeout(blobDl, 200);
  }

  symbolsInp.oninput = inputHandler;

  rinp.oninput = inputHandler;

  for (let i = 0; i < radios.length; i += 1) {
    radios[i].oninput = radioHandler;
  }

  genBtn.onclick = buttonHandler;
  downloadBtn.onclick = downloadHandler;

}

main();