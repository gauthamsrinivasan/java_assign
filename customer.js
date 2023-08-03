document.getElementById('customerForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Retrieve the token from localStorage
    const authToken = localStorage.getItem('authToken');
    console.log(authToken);
  
    if (!authToken) {
      alert('Authentication token not found. Please log in.');
      return;
    }
  
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create';
  
    const customerData = {
      "cmd": "create",
      "first_name": document.getElementById('first_name').value,
      "last_name": document.getElementById('last_name').value,
      "street": document.getElementById('street').value,
      "address": document.getElementById('address').value,
      "city": document.getElementById('city').value,
      "state": document.getElementById('state').value,
      "email": document.getElementById('email').value,
      "phone": document.getElementById('phone').value
    };
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    })
    .then(response => {
      if (response.status === 201) {
        alert('Customer created successfully!');
        fetchAndDisplayCustomerList();
      } else if (response.status === 400) {
        alert('Customer creation failed. First Name or Last Name is missing.');
      } else {
        alert('An error occurred while creating the customer.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  
  // ... previous code ...

// Function to fetch and display the customer list
function fetchAndDisplayCustomerList() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Authentication token not found. Please log in.');
      return;
    }
  
    const apiUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list';
  
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch customer list');
      }
      return response.json();
    })
    .then(data => {
      // Populate the table with customer data
      const tableBody = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ''; // Clear existing table rows
  
      data.forEach(customer => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = customer.first_name;
        row.insertCell().textContent = customer.last_name;
        row.insertCell().textContent = customer.street;
        row.insertCell().textContent = customer.address;
        row.insertCell().textContent = customer.city;
        row.insertCell().textContent = customer.state;
        row.insertCell().textContent = customer.email;
        row.insertCell().textContent = customer.phone;

        const actionCell = row.insertCell();
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => showEditForm(customer));
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteCustomer(customer.uuid));
    actionCell.appendChild(updateButton);
    actionCell.appendChild(deleteButton);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  function deleteCustomer(uuid) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Authentication token not found. Please log in.');
      return;
    }
  
    const apiUrl = `https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`;
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    })
    .then(response => {
      if (response.status === 200) {
        alert('Customer deleted successfully!');
        fetchAndDisplayCustomerList(); // Refresh the customer list
      } else if (response.status === 400) {
        alert('Customer not found.');
      } else {
        alert('An error occurred while deleting the customer.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function showEditForm(customer) {
    const editForm = document.getElementById('editForm');
    editForm.style.display = 'block';
  
    // Populate the edit form with customer data
    document.getElementById('edit_first_name').value = customer.first_name;
    document.getElementById('edit_last_name').value = customer.last_name;
    document.getElementById('edit_street').value = customer.street;
    document.getElementById('edit_address').value = customer.address;
    document.getElementById('edit_city').value = customer.city;
    document.getElementById('edit_state').value = customer.state;
    document.getElementById('edit_email').value = customer.email;
    document.getElementById('edit_phone').value = customer.phone;
  
    // Save the customer uuid in a hidden input field
    console.log(customer.uuid);
    document.getElementById('edit_uuid').value = customer.uuid;
  }
  
  function submitUpdatedCustomer() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Authentication token not found. Please log in.');
      return;
    }
    let uuid=document.getElementById('edit_uuid').value;
    console.log("submit uuid"+ uuid);    
    const apiUrl = `https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`;
    
    const updatedCustomerData = {
      
    //   "uuid": document.getElementById('edit_uuid').value,
      "first_name": document.getElementById('edit_first_name').value,
      "last_name": document.getElementById('edit_last_name').value,
      "street": document.getElementById('edit_street').value,
      "address": document.getElementById('edit_address').value,
      "city": document.getElementById('edit_city').value,
      "state": document.getElementById('edit_state').value,
      "email": document.getElementById('edit_email').value,
      "phone": document.getElementById('edit_phone').value
    };
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCustomerData)
    })
    .then(response => {
      if (response.status === 200) {
        alert('Customer updated successfully!');
        document.getElementById('editForm').style.display = 'none';
        fetchAndDisplayCustomerList(); // Refresh the customer list
      } else if (response.status === 400) {
        alert('Customer not found.');
      } else {
        alert('An error occurred while updating the customer.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  function showCreateForm() {
    document.getElementById('createForm').style.display = 'block';
  }
  function hideCreateForm() {
    document.getElementById('createForm').style.display = 'none';
  }
  
  // Fetch and display customer list when the page loads
  fetchAndDisplayCustomerList();
  

  