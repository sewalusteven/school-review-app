function formatUgandanPhoneNumber(phoneNumber) {
    // Remove any non-digit characters from the input
    phoneNumber = phoneNumber.replace(/\D/g, '');

    // Check the length of the phone number and format accordingly
    if (phoneNumber.length === 10) {
        // Add "0" to the beginning of 10-digit numbers
        return '0' + phoneNumber.slice(1).replace(/(\d{3})(\d{6})/, '$1-$2');
    } else if (phoneNumber.length === 9) {
        // Add "0" to the beginning of 9-digit numbers
        return '0' + phoneNumber.replace(/(\d{3})(\d{6})/, '$1-$2');
    } else if (phoneNumber.length === 12 && phoneNumber.startsWith('256')) {
        // Format as "+256 XXX-XXXXXX"
        return phoneNumber.replace(/(\d{3})(\d{6})/, '+256 $1-$2');
    } else {
        // Invalid phone number format
        return 'Invalid phone number';
    }
}

console.log(formatUgandanPhoneNumber('0755283400'))