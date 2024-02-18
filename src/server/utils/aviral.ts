import axios from "axios";

import { db } from "~/server/db";

const BASE_URL = 'https://aviral.iiita.ac.in/api/';

type StudentAviralData = Promise<{
  username: string;
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

type FacultyAviralData = Promise<{
  username: string;
  name: string;
  interest: string;
} | null>;


export const getStudentAviralData = async (username: string, password: string): StudentAviralData => {
  try {
    const aviralSession = await db.config.findFirst({
      where: {
        key: 'AVIRAL_SESSION',
      },
    });
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
        Session: aviralSession.value,
      },
    });

    if (res.status !== 200) {
      throw new Error('Invalid Credentials');
    }

    const data = {
      username: username,
      name:
        (res.data['first_name'] +
          ' ' +
          res.data['middle_name'] +
          ' ' +
          res.data['last_name']).trim(),

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

export const getFacultyAviralData = async (username: string, password: string): FacultyAviralData => {
  try {
    const aviralSession = await db.config.findFirst({
      where: {
        key: 'AVIRAL_SESSION',
      },
    });
    let res = await axios.post(BASE_URL + 'login/', {
      username: username?.toLowerCase(),
      password,
    });

    if (res.status !== 200) {
      throw new Error('Invalid Credentials');
    }

    res = await axios.get(BASE_URL + 'faculty/dashboard/', {
      headers: {
        Authorization: res.data['jwt_token'],
        Session: aviralSession.value,
      },
    });

    if (res.status !== 200) {
      throw new Error('Invalid Credentials');
    }

    const data = {
      username: username,
      name:
        (res.data['first_name'] +
          ' ' +
          res.data['middle_name'] +
          ' ' +
          res.data['last_name']).trim(),
      interest: res.data['interest'],
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
  return verifyAviralPassword(username, password);
}


