import axios from "axios";
const BASE_URL = 'https://aviral.iiita.ac.in/api/';

type AviralData = Promise<{
    name: string;
    semester: number;
    rollNumber: string;
    mobile: string;
    cgpa: number;
    completedCredits: number;
    totalCredits: number;
    program: string;
    admissionYear: number;  
} | null>;



export const getAviralData = async (username : string, password : string) : AviralData => {
    try {
      let res = await axios.post(BASE_URL + 'login/', {
        username: username?.toLowerCase(),
        password,
      });
  
      if (res.status !== 200) {
        throw new Error('Invalid Credentials');
      }
  
      res = await axios.get(BASE_URL + 'student/dashboard/', {
        headers: {
          Authorization: res.data['jwt_token'],
          Session: 'JAN-23',
        },
      });
  
      if (res.status !== 200) {
        throw new Error('Invalid Credentials');
      }
  
      const data = {
        name:
          res.data['first_name'] +
          ' ' +
          res.data['middle_name'] +
          ' ' +
          res.data['last_name'],
  
        semester: res.data['semester'],
        rollNumber: res.data['student_id'],
        mobile: res.data['phone'],
        cgpa: res.data['cgpi'],
        completedCredits: res.data['completed_total'],
        totalCredits: res.data['total_credits'],
        program: res.data['program'],
        admissionYear: res.data['admission_year'],
      };
  
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
};
  