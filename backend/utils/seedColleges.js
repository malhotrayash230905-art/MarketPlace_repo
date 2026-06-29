const College = require('../models/College');

const collegesData = [
  // Tier 1
  { collegeName: "IIT Bombay", city: "Mumbai", state: "Maharashtra", tier: "Tier 1" },
  { collegeName: "IIT Delhi", city: "New Delhi", state: "Delhi", tier: "Tier 1" },
  { collegeName: "IIT Madras", city: "Chennai", state: "Tamil Nadu", tier: "Tier 1" },
  { collegeName: "IIT Kanpur", city: "Kanpur", state: "Uttar Pradesh", tier: "Tier 1" },
  { collegeName: "IIT Kharagpur", city: "Kharagpur", state: "West Bengal", tier: "Tier 1" },
  { collegeName: "IIT Roorkee", city: "Roorkee", state: "Uttarakhand", tier: "Tier 1" },
  { collegeName: "IIT Guwahati", city: "Guwahati", state: "Assam", tier: "Tier 1" },
  { collegeName: "IIT Hyderabad", city: "Hyderabad", state: "Telangana", tier: "Tier 1" },
  { collegeName: "IIT Indore", city: "Indore", state: "Madhya Pradesh", tier: "Tier 1" },
  { collegeName: "IIT BHU", city: "Varanasi", state: "Uttar Pradesh", tier: "Tier 1" },
  { collegeName: "IIT Patna", city: "Patna", state: "Bihar", tier: "Tier 1" },
  { collegeName: "IIT Gandhinagar", city: "Gandhinagar", state: "Gujarat", tier: "Tier 1" },
  { collegeName: "IIT Ropar", city: "Rupnagar", state: "Punjab", tier: "Tier 1" },
  { collegeName: "IIT Mandi", city: "Mandi", state: "Himachal Pradesh", tier: "Tier 1" },
  { collegeName: "IIT Jodhpur", city: "Jodhpur", state: "Rajasthan", tier: "Tier 1" },
  { collegeName: "IIT Bhubaneswar", city: "Bhubaneswar", state: "Odisha", tier: "Tier 1" },
  { collegeName: "IIT Tirupati", city: "Tirupati", state: "Andhra Pradesh", tier: "Tier 1" },
  { collegeName: "IIT Palakkad", city: "Palakkad", state: "Kerala", tier: "Tier 1" },
  { collegeName: "IIT Dhanbad", city: "Dhanbad", state: "Jharkhand", tier: "Tier 1" },
  { collegeName: "IIT Bhilai", city: "Bhilai", state: "Chhattisgarh", tier: "Tier 1" },
  { collegeName: "IIT Goa", city: "Ponda", state: "Goa", tier: "Tier 1" },
  { collegeName: "IIT Jammu", city: "Jammu", state: "Jammu and Kashmir", tier: "Tier 1" },
  { collegeName: "IIT Dharwad", city: "Dharwad", state: "Karnataka", tier: "Tier 1" },
  
  { collegeName: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", tier: "Tier 1" },
  { collegeName: "NIT Surathkal", city: "Mangalore", state: "Karnataka", tier: "Tier 1" },
  { collegeName: "NIT Rourkela", city: "Rourkela", state: "Odisha", tier: "Tier 1" },
  { collegeName: "NIT Warangal", city: "Warangal", state: "Telangana", tier: "Tier 1" },
  { collegeName: "MNNIT Allahabad", city: "Allahabad", state: "Uttar Pradesh", tier: "Tier 1" },
  { collegeName: "VNIT Nagpur", city: "Nagpur", state: "Maharashtra", tier: "Tier 1" },
  { collegeName: "MANIT Bhopal", city: "Bhopal", state: "Madhya Pradesh", tier: "Tier 1" },
  { collegeName: "MNIT Jaipur", city: "Jaipur", state: "Rajasthan", tier: "Tier 1" },
  { collegeName: "NIT Calicut", city: "Kozhikode", state: "Kerala", tier: "Tier 1" },
  { collegeName: "NIT Durgapur", city: "Durgapur", state: "West Bengal", tier: "Tier 1" },
  { collegeName: "NIT Kurukshetra", city: "Kurukshetra", state: "Haryana", tier: "Tier 1" },
  { collegeName: "NIT Silchar", city: "Silchar", state: "Assam", tier: "Tier 1" },
  { collegeName: "NIT Jalandhar", city: "Jalandhar", state: "Punjab", tier: "Tier 1" },
  { collegeName: "NIT Meghalaya", city: "Shillong", state: "Meghalaya", tier: "Tier 1" },
  { collegeName: "NIT Raipur", city: "Raipur", state: "Chhattisgarh", tier: "Tier 1" },
  { collegeName: "NIT Agartala", city: "Agartala", state: "Tripura", tier: "Tier 1" },
  { collegeName: "NIT Goa", city: "Ponda", state: "Goa", tier: "Tier 1" },
  { collegeName: "NIT Jamshedpur", city: "Jamshedpur", state: "Jharkhand", tier: "Tier 1" },
  { collegeName: "NIT Patna", city: "Patna", state: "Bihar", tier: "Tier 1" },
  { collegeName: "NIT Hamirpur", city: "Hamirpur", state: "Himachal Pradesh", tier: "Tier 1" },
  { collegeName: "NIT Puducherry", city: "Karaikal", state: "Puducherry", tier: "Tier 1" },
  { collegeName: "NIT Uttarakhand", city: "Srinagar", state: "Uttarakhand", tier: "Tier 1" },
  { collegeName: "NIT Delhi", city: "New Delhi", state: "Delhi", tier: "Tier 1" },
  { collegeName: "NIT Mizoram", city: "Aizawl", state: "Mizoram", tier: "Tier 1" },

  { collegeName: "IIIT Allahabad", city: "Allahabad", state: "Uttar Pradesh", tier: "Tier 1" },
  { collegeName: "IIIT Hyderabad", city: "Hyderabad", state: "Telangana", tier: "Tier 1" },
  { collegeName: "IIIT Bangalore", city: "Bangalore", state: "Karnataka", tier: "Tier 1" },
  { collegeName: "IIIT Delhi", city: "New Delhi", state: "Delhi", tier: "Tier 1" },
  { collegeName: "IIIT Pune", city: "Pune", state: "Maharashtra", tier: "Tier 1" },
  { collegeName: "IIIT Kota", city: "Kota", state: "Rajasthan", tier: "Tier 1" },
  { collegeName: "IIIT Guwahati", city: "Guwahati", state: "Assam", tier: "Tier 1" },
  { collegeName: "IIIT Vadodara", city: "Vadodara", state: "Gujarat", tier: "Tier 1" },
  { collegeName: "IIIT Sri City", city: "Sri City", state: "Andhra Pradesh", tier: "Tier 1" },
  { collegeName: "IIIT Lucknow", city: "Lucknow", state: "Uttar Pradesh", tier: "Tier 1" },
  { collegeName: "IIIT Dharwad", city: "Dharwad", state: "Karnataka", tier: "Tier 1" },
  { collegeName: "IIIT Kurnool", city: "Kurnool", state: "Andhra Pradesh", tier: "Tier 1" },
  { collegeName: "IIIT Kottayam", city: "Kottayam", state: "Kerala", tier: "Tier 1" },
  { collegeName: "IIIT Manipur", city: "Senapati", state: "Manipur", tier: "Tier 1" },

  // Tier 2
  { collegeName: "BITS Pilani - Pilani Campus", city: "Pilani", state: "Rajasthan", tier: "Tier 2" },
  { collegeName: "BITS Pilani - Goa Campus", city: "Goa", state: "Goa", tier: "Tier 2" },
  { collegeName: "BITS Pilani - Hyderabad Campus", city: "Hyderabad", state: "Telangana", tier: "Tier 2" },
  { collegeName: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "VIT Chennai", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "VIT Bhopal", city: "Bhopal", state: "Madhya Pradesh", tier: "Tier 2" },
  { collegeName: "VIT Andhra Pradesh", city: "Amaravati", state: "Andhra Pradesh", tier: "Tier 2" },
  { collegeName: "MIT Manipal", city: "Manipal", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "Manipal University Jaipur", city: "Jaipur", state: "Rajasthan", tier: "Tier 2" },
  { collegeName: "SRM KTR Campus", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "SRM Ramapuram Campus", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "KIIT University", city: "Bhubaneswar", state: "Odisha", tier: "Tier 2" },
  { collegeName: "Amity University Noida", city: "Noida", state: "Uttar Pradesh", tier: "Tier 2" },
  { collegeName: "Delhi Technological University (DTU)", city: "New Delhi", state: "Delhi", tier: "Tier 2" },
  { collegeName: "Netaji Subhas University of Technology (NSUT)", city: "New Delhi", state: "Delhi", tier: "Tier 2" },
  { collegeName: "Jadavpur University", city: "Kolkata", state: "West Bengal", tier: "Tier 2" },
  { collegeName: "Anna University", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "Delhi University", city: "New Delhi", state: "Delhi", tier: "Tier 2" },
  { collegeName: "Jamia Millia Islamia", city: "New Delhi", state: "Delhi", tier: "Tier 2" },
  { collegeName: "Aligarh Muslim University", city: "Aligarh", state: "Uttar Pradesh", tier: "Tier 2" },
  { collegeName: "Banaras Hindu University (BHU)", city: "Varanasi", state: "Uttar Pradesh", tier: "Tier 2" },
  { collegeName: "Thapar Institute of Engineering and Technology", city: "Patiala", state: "Punjab", tier: "Tier 2" },
  { collegeName: "BMS College of Engineering", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "RV College of Engineering", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "PES University", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "MSRIT", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "Dayananda Sagar College of Engineering", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "VJTI", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "SPIT", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "COEP", city: "Pune", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "PICT", city: "Pune", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "Nirma University", city: "Ahmedabad", state: "Gujarat", tier: "Tier 2" },
  { collegeName: "DA-IICT", city: "Gandhinagar", state: "Gujarat", tier: "Tier 2" },
  { collegeName: "Heritage Institute of Technology", city: "Kolkata", state: "West Bengal", tier: "Tier 2" },
  { collegeName: "Haldia Institute of Technology", city: "Haldia", state: "West Bengal", tier: "Tier 2" },
  { collegeName: "IEM Kolkata", city: "Kolkata", state: "West Bengal", tier: "Tier 2" },
  { collegeName: "Jain University", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "Christ University", city: "Bangalore", state: "Karnataka", tier: "Tier 2" },
  { collegeName: "Symbiosis International University", city: "Pune", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "NMIMS", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "Osmania University", city: "Hyderabad", state: "Telangana", tier: "Tier 2" },
  { collegeName: "University of Hyderabad", city: "Hyderabad", state: "Telangana", tier: "Tier 2" },
  { collegeName: "Andhra University", city: "Visakhapatnam", state: "Andhra Pradesh", tier: "Tier 2" },
  { collegeName: "Madras Institute of Technology", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "SSN College of Engineering", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "Sathyabama Institute", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "Hindustan Institute of Technology and Science", city: "Chennai", state: "Tamil Nadu", tier: "Tier 2" },
  { collegeName: "Vidyalankar Institute of Technology", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "KJ Somaiya", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "DJ Sanghvi", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },
  { collegeName: "Thadomal Shahani Engineering College", city: "Mumbai", state: "Maharashtra", tier: "Tier 2" },

  // Tier 3 Medical
  { collegeName: "AIIMS Delhi", city: "New Delhi", state: "Delhi", tier: "Tier 3 Medical" },
  { collegeName: "AIIMS Bhopal", city: "Bhopal", state: "Madhya Pradesh", tier: "Tier 3 Medical" },
  { collegeName: "AIIMS Rishikesh", city: "Rishikesh", state: "Uttarakhand", tier: "Tier 3 Medical" },
  { collegeName: "AIIMS Jodhpur", city: "Jodhpur", state: "Rajasthan", tier: "Tier 3 Medical" },
  { collegeName: "AIIMS Patna", city: "Patna", state: "Bihar", tier: "Tier 3 Medical" },
  { collegeName: "AIIMS Raipur", city: "Raipur", state: "Chhattisgarh", tier: "Tier 3 Medical" },
  { collegeName: "AIIMS Bhubaneswar", city: "Bhubaneswar", state: "Odisha", tier: "Tier 3 Medical" },
  { collegeName: "CMC Vellore", city: "Vellore", state: "Tamil Nadu", tier: "Tier 3 Medical" },
  { collegeName: "JIPMER Puducherry", city: "Puducherry", state: "Puducherry", tier: "Tier 3 Medical" },

  // Tier 4 Business
  { collegeName: "IIM Ahmedabad", city: "Ahmedabad", state: "Gujarat", tier: "Tier 4 Business" },
  { collegeName: "IIM Bangalore", city: "Bangalore", state: "Karnataka", tier: "Tier 4 Business" },
  { collegeName: "IIM Calcutta", city: "Kolkata", state: "West Bengal", tier: "Tier 4 Business" },
  { collegeName: "IIM Lucknow", city: "Lucknow", state: "Uttar Pradesh", tier: "Tier 4 Business" },
  { collegeName: "IIM Indore", city: "Indore", state: "Madhya Pradesh", tier: "Tier 4 Business" },
  { collegeName: "IIM Kozhikode", city: "Kozhikode", state: "Kerala", tier: "Tier 4 Business" },
  { collegeName: "MDI Gurgaon", city: "Gurgaon", state: "Haryana", tier: "Tier 4 Business" },
  { collegeName: "SPJIMR", city: "Mumbai", state: "Maharashtra", tier: "Tier 4 Business" },
  { collegeName: "XLRI", city: "Jamshedpur", state: "Jharkhand", tier: "Tier 4 Business" },
  { collegeName: "FMS Delhi", city: "New Delhi", state: "Delhi", tier: "Tier 4 Business" },
  { collegeName: "IIFT Delhi", city: "New Delhi", state: "Delhi", tier: "Tier 4 Business" },
  { collegeName: "JBIMS", city: "Mumbai", state: "Maharashtra", tier: "Tier 4 Business" },
  { collegeName: "TISS", city: "Mumbai", state: "Maharashtra", tier: "Tier 4 Business" },
  { collegeName: "NID", city: "Ahmedabad", state: "Gujarat", tier: "Tier 4 Business" },
  { collegeName: "NIFT", city: "New Delhi", state: "Delhi", tier: "Tier 4 Business" },
  { collegeName: "NALSAR", city: "Hyderabad", state: "Telangana", tier: "Tier 4 Business" },
  { collegeName: "NLSIU", city: "Bangalore", state: "Karnataka", tier: "Tier 4 Business" },
  { collegeName: "JNU", city: "New Delhi", state: "Delhi", tier: "Tier 4 Business" }
];

async function seedColleges() {
  try {
    console.log(`Seeding/updating ${collegesData.length} Indian Colleges...`);
    
    // Instead of dropping or conditionally inserting, we'll upsert each one.
    // This preserves existing ObjectIds for colleges already in the DB.
    let updatedCount = 0;
    for (const college of collegesData) {
      await College.updateOne(
        { collegeName: college.collegeName },
        { $set: college },
        { upsert: true }
      );
      updatedCount++;
    }
    
    console.log(`Successfully seeded/updated ${updatedCount} colleges.`);
  } catch (err) {
    console.error('Error seeding colleges:', err);
  }
}

module.exports = seedColleges;
