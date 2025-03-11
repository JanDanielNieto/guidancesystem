document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('student-form');
    const studentList = document.getElementById('student-list');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const studentName = document.getElementById('student-name').value;
        const offenceReason = document.getElementById('offence-reason').value;
        const offenceType = document.getElementById('offence-type').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        if (studentId && studentName && offenceReason && offenceType && date && time) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${studentId}</td>
                <td>${studentName}</td>
                <td>${offenceReason}</td>
                <td>${offenceType}</td>
                <td>${date}</td>
                <td>${time}</td>
            `;
            studentList.appendChild(newRow);
            form.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
});