import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase.js";

export async function getStudentData(inputRollNo) {
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("rollNo", "==", inputRollNo));

    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {

            const data = querySnapshot.docs[0].data()

            console.log("Found User:", data.name);
            console.log("Total Contributed:", data.totalPaid);

            return data
        } else {
            console.log("No student found with that Roll Number.");
            return { name: "na", totalPaid: 0 }

        }
    } catch (error) {
        console.error("Error fetching student:", error);
    }
}