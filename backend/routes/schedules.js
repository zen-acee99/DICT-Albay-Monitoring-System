const express = require("express");
const axios = require("axios");

const router = express.Router();

const SHEET_ID = "1L_TU3zUFRqj5CS1avunjPt9a-psHkQqQVBUHYTaVzt0";
const GID = "18955515";


async function getSheetData(){

    const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;


    const response = await axios.get(url);


    // remove google wrapper
    const json = response.data
      .replace("/*O_o*/\ngoogle.visualization.Query.setResponse(", "")
      .replace(");", "");


    const data = JSON.parse(json);


    const headers = data.table.cols.map(
        col => col.label
    );


    const rows = data.table.rows.map(row=>{

        let obj={};

        row.c.forEach((cell,index)=>{

            obj[headers[index]] =
            cell ? cell.v : "";

        });


        return obj;

    });


    return rows;

}



router.get("/", async(req,res)=>{

    try{

        const data = await getSheetData();


        const formatted = data.map(row=>({

            month: row["Month"] || "",
            startDate: row["Start Date"] || "",
            endDate: row["End Date"] || "",
            startTime: row["Start Time"] || "",
            endTime: row["End Time"] || "",
            duration: row["Duration"] || "",
            title: row["Title"] || "",
            project: row["Project/Program"] || "",
            location: row["Location"] || "",
            targetSector: row["Target Sector"] || "",
            mode: row["Mode"] || "",
            status: row["Status"] || "",
            assignedStaff: row["Assigned Staff"] || "",
            remarks: row["Remarks"] || "",
            movLink: row["MOV Link"] || ""

        }));


        res.json(formatted);


    }catch(error){

        console.error(
          "GOOGLE SHEET ERROR:",
          error.message
        );


        res.status(500).json({
            error:error.message
        });

    }

});


module.exports = router;