import { collection, query, where, getDocs,orderBy,increment,updateDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../../js/services/firebase.js";

export async function getStudentData(inputRollNo) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("rollNo", "==", inputRollNo));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No student found with that Roll Number.");
      return;
    }


    for (const docSnap of querySnapshot.docs) {
      await updateDoc(docSnap.ref, {
        totalPaid: increment(20)
      });
      console.log(`Updated Roll No: ${inputRollNo}`);
    }

  } catch (error) {
    console.error("Error updating student:", error);
  }
}

