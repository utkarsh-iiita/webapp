import axios from "axios";
import { env } from "@/env";

const BASE_URL = 'https://aviral.iiita.ac.in/api/';

type AviralData = Promise<{
  name: string;
  currentSem: string;
  rollNumber: string;
  mobile: string;
  cgpa: number;
  completedCredits: number;
  totalCredits: number;
  program: string;
  duration: number;
  admissionYear: number;
} | null>;



export const getStudentAviralData = async (username: string, password: string): AviralData => {
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
        Session: env.AVIRAL_SESSION,
      },
    });

    if (res.status !== 200) {
      throw new Error('Invalid Credentials');
    }

    const data = {
      username: username,
      name:
        res.data['first_name'] +
        ' ' +
        res.data['middle_name'] +
        ' ' +
        res.data['last_name'],

      currentSem: res.data['semester'],
      rollNumber: res.data['student_id'],
      mobile: res.data['phone'],
      cgpa: res.data['cgpi'],
      completedCredits: res.data['completed_total'],
      totalCredits: res.data['total_credits'],
      program: res.data['program'],
      admissionYear: res.data['admission_year'],
      duration: res.data['duration']
    };

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyAviralPassword = async (username: string, password: string) => {
  let res = await axios.post(BASE_URL + 'login/', {
    username: username?.toLowerCase(),
    password,
  });
  return res.data['user_group'];
};



export function verifyPassword(username: string, password: string) {
  // if (env.USE_AVIRAL === 'true') {
  return verifyAviralPassword(username, password);
  // } else {
  // return authenticateLdap(username, password);
  // }
}


