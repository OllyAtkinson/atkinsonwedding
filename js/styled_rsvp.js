document.getElementById('form').addEventListener('submit', function (event) {
    document.getElementById('submit').classList.add('is-loading');
    event.preventDefault();
    var name = this.elements.name.value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyQUo6fsmiplg-MF4_LNDF87-1XKAl01-zA-j0Lo892GhkWSrz_aAS2g-BAVOVRPlyRRg/exec?name=' + encodeURIComponent(name), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            document.getElementById('submit').classList.remove('is-loading');
            var idAndNames = xhr.responseText;
            if (idAndNames === "Name not found") {
                document.getElementById('output').innerHTML = `<div class="notification is-danger">Couldn't find guest name.</div>`;
            } else if (idAndNames === "Already RSVPd") {
                document.getElementById('output').innerHTML = `<div class="notification is-danger">This guest has already submitted an RSVP.</div>`;
            } else {
                create_rsvpPage1(idAndNames);
            }
        }
    };
    xhr.send();
});

function create_rsvpPage1(idAndNames) {
    const data = [];
    const inputArray = idAndNames.split(',');
    const inviteID = inputArray.shift() || "NA";

    inputArray.forEach((name, index) => {
        if (name) {
            data.push({
                inviteID: inviteID,
                name: name,
                attending: 0,
                starter: '',
                main: '',
                afters: '',
                dietReq: '',
                id: `person${index}`
            });
        }
    });

    document.getElementById('entireForm').innerHTML = `
        <div class="content">
            <p>We found your RSVP!</p>
            ${data.map(person => `
                <div class="card mb-4">
                    <div class="card-content">
                        <p class="subtitle">${person.name}</p>
                        <div class="field">
                            <label class="checkbox">
                                <input type="checkbox" id="${person.id}" class="attendCheckbox">
                                <span class="ml-2">Attending?</span>
                            </label>
                        </div>
                        <div class="mealOptions" id="options-${person.id}" style="display: none;">
                            <div class="field">
                                <label class="label">Starter</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="starter-${person.id}">
                                            <option value="">Select a starter</option>
                                            <option value="Fillet of Smoked Salmon">Fillet of Smoked Salmon</option>
                                            <option value="Vegetable Soup">Vegetable Soup</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Main</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="main-${person.id}">
                                            <option value="">Select a main</option>
                                            <option value="Cannon of Beef (Medium-Rare)">Cannon of Beef (Medium-Rare)</option>
                                            <option value="Butternut Squash Gnocchi">Butternut Squash Gnocchi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Afters</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="afters-${person.id}">
                                            <option value="">Select an after</option>
                                            <option value="Keele Mess">Keele Mess</option>
                                            <option value="Sticky Toffee Pudding">Sticky Toffee Pudding</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Dietary Requirements</label>
                                <div class="control">
                                    <textarea id="dietReq-${person.id}" class="textarea" placeholder="Enter any dietary requirements"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="field">
                <div class="control has-text-centered">
                    <button id="submit" class="button is-link">Submit</button>
                </div>
            </div>
        </div>
    `;

    data.forEach(person => {
        const checkbox = document.getElementById(person.id);
        const options = document.getElementById(`options-${person.id}`);
        checkbox.addEventListener('change', () => {
            options.style.display = checkbox.checked ? 'block' : 'none';
        });
    });

    document.getElementById('submit').addEventListener('click', () => {
        document.getElementById('submit').classList.add('is-loading');
        data.forEach(person => {
            person.attending = document.getElementById(person.id).checked ? 1 : 0;
            person.starter = document.getElementById(`starter-${person.id}`).value;
            person.main = document.getElementById(`main-${person.id}`).value;
            person.afters = document.getElementById(`afters-${person.id}`).value;
            person.dietReq = document.getElementById(`dietReq-${person.id}`).value;
        });
        console.log(data)
        submitForm(data);
        document.getElementById('submit').disabled = true;
    });
}

function submitForm(data) {
    const url = 'https://script.google.com/macros/s/AKfycbyQUo6fsmiplg-MF4_LNDF87-1XKAl01-zA-j0Lo892GhkWSrz_aAS2g-BAVOVRPlyRRg/exec';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.responseText === 'Success') {
            document.getElementById('submit').classList.remove('is-loading');
            document.getElementById('entireForm').innerHTML = `<div class="notification is-success">Thank you! Your RSVP has been submitted successfully.</div>`;
        } else {
            document.getElementById('submit').classList.remove('is-loading');
            document.getElementById('entireForm').innerHTML = `<div class="notification is-danger">An error occurred. Please try again later.</div>`;
        }
    };
    xhr.send(JSON.stringify(data));
}


