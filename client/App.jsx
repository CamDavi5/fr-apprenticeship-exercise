import React, { useState, useEffect } from "react";

const App = () => {
    const [balance, setBalance] = useState([]);
    const [customVal, setCustomVal] = useState(0);
    const [newPayer, setNewPayer] = useState("");
    const [newPoints, setNewPoints] = useState(0);

    const handleCustomVal = (e) => setCustomVal(e.target.value);
    const handleNewPayer = (e) => setNewPayer(e.target.value);
    const handleNewPoints = (e) => setNewPoints(e.target.value);

    useEffect(() => {
      refreshBalance();
    }, []);



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

    const balanceSum = (total) => {
      let totalPoints = {};
      total.forEach((item) => {
        totalPoints[item.payer] = 0;
      })

      total.forEach((item) => {
        totalPoints[item.payer] += item.points;
      })

      //console.log(JSON.stringify(totalPoints));

      setBalance(totalPoints);
    }

    const spendPoints = (cost) => {
      fetch('http://localhost:3000/mysql/fetch/')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(total => {
        let realBalance = reorderBalance(total);
        //console.log(JSON.stringify(realBalance[0]));
        handlePayment(realBalance, cost);
      });
    }

    const reorderBalance = (total) => {
      let i = 0;
      for (i; i<total.length; i++) {
        let tempTS = total[i].timestamp
        let convertTS = Date.parse(tempTS);
        total[i].timestamp = convertTS;
        //console.log(convertTS);
      }
      
      let x = 1;
      for(x; x<total.length; x++){ 
        let temp = total[x];    
        let w = x-1;
        while(w>=0 && total[w].timestamp>temp.timestamp){
          total[w+1] = total[w];   
          w = w-1;
  
        }
        total[w+1] = temp;   
               
        }

      let negativeArr = [];
      for(i=0; i<total.length; i++) {
        if (total[i].points < 0) {
          negativeArr.push(total[i]);
          total[i] = null;
        }
      }
      
      let n = 0;
      for (n; n<negativeArr.length; n++) {
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
      
      return total;
    }

    const handlePayment = (rb, fee) => {
      //let fee = 5000;
      let overdraftCheck = 0;
      let k = 0;
      for (k; k<rb.length; k++) {
        if ((rb[k]) != null) {
          overdraftCheck += rb[k].points;
        }
      }

      if (fee > overdraftCheck) {
        console.log("You don't have enough points for this transaction!");
        return;
      }
      
      let paidPoints = [];

      let x = 0;
      for (x; x<rb.length; x++) {
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
      for (j; j<paidPoints.length; j++) {
        //console.log(JSON.stringify(paidPoints[j]));
        postPoints(paidPoints[j]);
      }
      
    }

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

    const defaultPay = () => {
      spendPoints(5000);
    }

    const customPay = () => {
      let copy = customVal;
      spendPoints(copy);
    } 

    const addTransaction = () => {
      let payCopy = newPayer;
      let pointsCopy = newPoints;
      postPoints({payer: payCopy, points: pointsCopy});
    }

    return (
      <>
        <div>So how bout that weather, Fetch person looking over this?</div>
        <div>
            <div className="d-flex">
              <p>Current Balance:  </p>
              <button onClick={refreshBalance}>Refresh</button>
            </div>
            <div>{JSON.stringify(balance)}</div>
        </div>
        <div className="d-flex">
          <p>Default Payment - 5000</p>
          <button onClick={defaultPay}>Default Pay</button>
        </div>
        <div className="d-flex">
        <input onChange={handleCustomVal} type="text" />
        <button onClick={customPay}>Custom Pay</button>
        </div>
        <div className="d-flex">
        <input onChange={handleNewPayer} type="text" />
        <input onChange={handleNewPoints} type="text" />
        <button onClick={addTransaction}>Add Transaction</button>
        </div>
      </>
    );
  };

  export default App;
