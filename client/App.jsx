import React, { useState, useEffect } from "react";

const App = () => {
    const [balance, setBalance] = useState([]);
    const [customVal, setCustomVal] = useState(0);
    const [newPayer, setNewPayer] = useState("");
    const [newPoints, setNewPoints] = useState(0);

    const handleCustomVal = (e) => setCustomVal(e.target.value);
    const handleNewPayer = (e) => setNewPayer(e.target.value);
    const handleNewPoints = (e) => setNewPoints(e.target.value);

    //Loads the intial balance of the MySQL database
    useEffect(() => {
      refreshBalance();
    }, []);

    //Refreshes the displayed balance to reflect any changes after a payment or new transaction
    const refreshBalance = () => {
      fetch('http://localhost:3000/mysql/fetch/')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(total => {
        balanceSum(total);
        
      });
    }

    //Sums the incoming MySQL information and sorts by the "payer"
    const balanceSum = (total) => {
      let totalPoints = {};
      total.forEach((item) => {
        totalPoints[item.payer] = 0;
      })

      total.forEach((item) => {
        totalPoints[item.payer] += item.points;
      })

      setBalance(totalPoints);
    }

    //Beginning of the payment method that fetches the MySQL data
    const spendPoints = (cost) => {
      fetch('http://localhost:3000/mysql/fetch/')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(total => {
        let realBalance = reorderBalance(total);
        handlePayment(realBalance, cost);
      });
    }

    //Sorts the data by date in ascending order and replaces negative/zero'd points with null
    const reorderBalance = (total) => {
      let i = 0;
      for (i; i<total.length; i++) { //Converts each timestamp to a number
        let tempTS = total[i].timestamp
        let convertTS = Date.parse(tempTS);
        total[i].timestamp = convertTS;
      }
      
      let x = 1;
      for(x; x<total.length; x++){ //Sorts the object array in ascending order using insertion sort
        let temp = total[x];    
        let w = x-1;
        while(w>=0 && total[w].timestamp>temp.timestamp){
          total[w+1] = total[w];   
          w = w-1;
  
        }
        total[w+1] = temp;   
               
        }

      let negativeArr = [];
      for(i=0; i<total.length; i++) { //Removes objects with negative points and places them in a new array
        if (total[i].points < 0) {
          negativeArr.push(total[i]);
          total[i] = null;
        }
      }
      
      let n = 0;
      for (n; n<negativeArr.length; n++) { //The negative points are deducted from the positive points
        for (x=0; x<total.length; x++) {
          if (negativeArr[n].points == 0) {
            break;
          }
          if ((total[x]) != null && total[x].payer == negativeArr[n].payer) {
            if ((total[x].points + negativeArr[n].points) > 0) {
              total[x].points = total[x].points + negativeArr[n].points;
              negativeArr[n].points = 0;
            } else if ((total[x].points + negativeArr[n].points) <= 0) {
              negativeArr[n].points = total[x].points + negativeArr[n].points;
              total[x].points = 0;
            }
          }
        }
      }
      
      for (i=0; i<total.length; i++) { //Prevents payers with zero points from being calculated
        if (total[i] != null) {
          if (total[i].points == 0) {
            total[i] = null;
          }
        }
      }

      return total;
    }

    //Payment system that creates an object array of the points deducted
    const handlePayment = (rb, fee) => {
      let overdraftCheck = 0;
      let k = 0;
      for (k; k<rb.length; k++) { //Sums all of the points for a total
        if ((rb[k]) != null) {
          overdraftCheck += rb[k].points;
        }
      }

      if (fee > overdraftCheck) { //Overdraft check
        alert("You don't have enough points for this transaction!");
        return;
      }
      
      let paidPoints = [];

      let x = 0;
      for (x; x<rb.length; x++) { //Subtraction loop that starts from the oldest points
        if (fee == 0) {
          break;
        }
        if ((rb[x]) != null) {
          if ((rb[x].points - fee) > 0) {
            let pointNeg = {
              payer: rb[x].payer,
              points: (fee*(-1))
            }
            paidPoints.push(pointNeg);
            fee = 0;
          } else if ((rb[x].points - fee) <= 0) {
            fee = fee - rb[x].points;
            let pointNeg = {
              payer: rb[x].payer,
              points: (rb[x].points*(-1))
            }
            paidPoints.push(pointNeg);
          }
        }
      }

      let j = 0;
      for (j; j<paidPoints.length; j++) { //Sends negative points data to MySQL
        postPoints(paidPoints[j]);
      }
      
    }

    //Sends the object parameter to MySQL
    const postPoints = (obj) => {
      fetch('http://localhost:3000/mysql/fetch', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: null,
            payer: obj.payer,
            points: obj.points,
          })
        })
          .then(response => response.json())
          .then(points => {
            console.log('Success:', points);
          })
          .catch((error) => {
            console.error('Error:', error);

          })
    }

    //Default payment option 
    const defaultPay = () => {
      spendPoints(5000);
    }

    //Custom payment option
    const customPay = () => {
      let copy = customVal;

      let num = parseInt(copy);
      if (isNaN(num) == false) { //Points check for valid int that is positive
        if (num <= 0) {
          alert("Please enter a number larger than 0!");
          return;
        }
      } else {
        alert("Please enter a number!");
        return;
      }
      
      spendPoints(num);
    } 

    //Adds new transaction to the 
    const addTransaction = () => {
      let payCopy = newPayer;
      let pointsCopy = newPoints;

      if (payCopy == "") {
        alert("The payer field is empty!");
        return;
      } else if (payCopy.length > 50) {
        alert("Apologies. The 'payer' field has a 50 character limit, please shorten...");
        return;
      }

      let num = parseInt(pointsCopy);
      if (isNaN(num) == false) { //Points check for valid int that is positive
        if (num <= 0) {
          alert("Please enter a number larger than 0!");
          return;
        }
      } else {
        alert("Please enter a number!");
        return;
      }

      postPoints({payer: payCopy, points: num});
    }

    return (
      <>
        <h1>Cameron Davis's Fetch Coding Exercise</h1>
        <div className="mb-3">So how bout that weather, Fetch person looking over this?</div>
        <h3>Overall Balance</h3>
        <div>
            <div className="d-flex flex-row">
              <p className="pr-3">Current Balance: {JSON.stringify(balance)}</p>
              <button onClick={refreshBalance}>Refresh</button>
            </div>
        </div>
        <h3 className="mt-3">Pay System</h3>
        <div className="d-flex">
          <p>Default Payment - 5000</p>
          <button onClick={defaultPay}>Default Pay</button>
        </div>
        <div className="d-flex">
          <p>Custom Payment -</p>
          <input onChange={handleCustomVal} type="text" placeholder="points:"/>
          <button onClick={customPay}>Custom Pay</button>
        </div>
        <h3 className="mt-3">New Transaction</h3>
        <div className="d-flex">
          <input onChange={handleNewPayer} type="text" placeholder="payer:" />
          <input onChange={handleNewPoints} type="text" placeholder="points:"/>
          <button onClick={addTransaction}>Add Transaction</button>
        </div>
      </>
    );
  };

  export default App;
