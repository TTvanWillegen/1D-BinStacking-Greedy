function calc(requirements, pipeLength, cutWidth){
    let cutPipes = [];
    requirements.sort(function(a, b){return b-a}); //Sort from longest to smallest

    for(let req of requirements) {
        let isCut = false;
        if(req > pipeLength){
            throw new Error("Pipes too short");
        }

        for (let pipe of cutPipes) {
            let remaining = pipe.remainingLength(cutWidth);
            console.log(remaining, req, cutWidth)
            console.log(req + cutWidth, remaining)
            if ((req + cutWidth) <= remaining){
                isCut = true;
                pipe.addCut(req)
				break;
            }
        }
        if(!isCut){
            cutPipes.push(new Pipe(pipeLength, req));
        }
    }

    return cutPipes;
}
class Pipe {
    constructor(length, ...cuts){
        this.length = length;
        this.cuts = [];

        if(cuts !== undefined){
            for(let c of cuts){
                this.cuts.push(c)
            }
        }
    }

    addCut(cutLength){
        this.cuts.push(cutLength);
    }

    remainingLength(cutWidth){
        let total = 0;
        for(let c of this.cuts){
            total += c;
        }
        total += Math.max(0, this.cuts.length - 1) * cutWidth;
        return this.length - total;
    }
}
function updateMaxCutLength() {
    let pipeLength = document.getElementById("pipeLength").value
    let cutInputs = document.getElementsByClassName("cutLength")
    for (let c of cutInputs) {
        c.max = "" + pipeLength;
    }
}

function runCalculation() {
    let pipeLength = document.getElementById("pipeLength").value
    let cutWidth = document.getElementById("cutWidth").value / 1000

    let toCut = [];
    let cuts = document.querySelectorAll("#cutsContainer .row")
    for (let i = 0; i < cuts.length; i++) {
        let cut = cuts[i]
        let amount = cut.getElementsByClassName("cutAmount")[0].value
        let length = parseFloat(cut.getElementsByClassName("cutLength")[0].value)

        for (let j = 0; j < amount; j++) {
            toCut.push(length)
        }
    }

    console.log(toCut, pipeLength, cutWidth)
    try {
        doneCuts = calc(toCut, pipeLength, cutWidth)
        output(doneCuts, cutWidth)
    } catch (e) {
        let pc = document.getElementById("pipeContainer")
        pc.innerText = e
    }
}

function output(pipes, cutWidth) {
    console.log(pipes)

    let pc = document.getElementById("pipeContainer")
    while (pc.firstChild) {
        pc.removeChild(pc.lastChild)
    }
    for (let pipe of pipes) {
        let row = document.createElement("div")
        row.className = "row my-3"

        let col = document.createElement("div")
        col.className = "col"

        let progress = document.createElement("div")
        progress.className = "progress"

        let version = true
        for (let i = 0; i < pipe.cuts.length; i++) {
            let cut = pipe.cuts[i]
            let perc = (cut / pipe.length) * 100
            let progressBar = document.createElement("div")
            progressBar.className = version ? "progress-bar" : "progress-bar bg-warning"
            version = !version
            progressBar.role = "progressbar"
            progressBar.setAttribute("style", "width: " + perc + "\%")
            progressBar.setAttribute("aria-valuenow", "" + perc)
            progressBar.setAttribute("aria-valuemin", "0")
            progressBar.setAttribute("aria-valuemax", "100")
            progressBar.textContent = cut

            progress.appendChild(progressBar)

            let cutBar = document.createElement("div")
            cutBar.className = "progress-bar bg-danger"
            let cutPerc = (cutWidth / pipe.length) * 100
            cutBar.role = "progressbar"
            cutBar.setAttribute("style", "width: " + cutPerc + "\%")
            cutBar.setAttribute("aria-valuenow", "" + cutPerc)
            cutBar.setAttribute("aria-valuemin", "0")
            cutBar.setAttribute("aria-valuemax", "100")
            progress.appendChild(cutBar)
        }
        col.appendChild(progress)
        row.appendChild(col)
        pc.appendChild(row)
    }
}

function addExtra() {
    let container = document.getElementById("cutsContainer");
    let cuts = document.getElementsByClassName("cutLength");

    let pipeLength = document.getElementById("pipeLength").value

    // Append a node with a random text
    let row = document.createElement("div");
    row.className = "row my-1"

    // Create an <input> element, set its type and name attributes
    let amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.id = "cutAmount-" + cuts.length;
    amountInput.className = "form-control cutAmount"
    amountInput.placeholder = "Amount"
    amountInput.setAttribute("step", "1")
    amountInput.setAttribute("min", "0")
    amountInput.setAttribute("max", "" + pipeLength)

    let amountLabel = document.createElement("label")
    amountLabel.htmlFor = "cutAmount-" + cuts.length
    amountLabel.textContent = "Amount"

    let col3 = document.createElement("div")
    col3.className = "col-3 form-floating"
    col3.appendChild(amountInput)
    col3.appendChild(amountLabel)
    row.appendChild(col3)

    // Create an <input> element, set its type and name attributes
    let lengthInput = document.createElement("input");
    lengthInput.type = "number";
    lengthInput.id = "cutLength-" + cuts.length;
    lengthInput.className = "form-control cutLength"
    lengthInput.placeholder = "Cut Length (m)"
    lengthInput.setAttribute("step", "0.001")
    lengthInput.setAttribute("min", "0")

    let lengthLabel = document.createElement("label")
    lengthLabel.htmlFor = "cutLength-" + cuts.length
    lengthLabel.textContent = "Cut lengths (m)"

    let col9 = document.createElement("div")
    col9.className = "col-9 form-floating"
    col9.appendChild(lengthInput)
    col9.appendChild(lengthLabel)
    row.appendChild(col9)

    container.appendChild(row);
}