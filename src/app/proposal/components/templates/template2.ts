import moment from "moment";

export const template2 = (data:any)=>{
  const sidbarColor = data.primary_color || "#aeaeae";
  const fontfamily = "Arial, Helvetica, sans-serif";
  const pageBackground =
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/4907ddddddddddddd157.jpg";
  const pageBackground2 =
    "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/4907ddddddddddddd157.jpg";
  const paragraphs = (text: string) => {
    return `<p style="font-size: 20px; text-align: left; font-family:'${fontfamily}';">
    ${text}
    </p>`;
  };
  const paragraphscenter = (text: string) => {
    return `<p style="font-size: 20px; text-align: center; font-family:'${fontfamily}';">
    ${text}
    </p>`;
  };
  const heddings = (text: string) => {
    return ` <h1  style="margin-bottom: 0px; font-family:'${fontfamily}';">
    ${text}
    </h1>`;
  };
  const hedding2 = (text: string) => {
    return ` <h3  style="margin-bottom: 0px; font-family:'${fontfamily}';">
    ${text}
    </h3>`;
  };
  const listItem = (text: string) => {
    return `<li style="font-size: 20px; text-align: left;  margin-top: 10px;">${text}</li>`;
  };
  const regex = /,\s*(?![^()]*\))/g;
  const services = data?.about_from_services?.split(regex);
  const technogies = data?.about_from_technologies?.split(regex);
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body style="padding: 0px; margin: 0px;">
    <div style="text-align: center; height: 100vh; background-image: url('${pageBackground}');">
          
          <div style="height: 100%; overflow: hidden;  display: flex; flex-direction: column; align-items: center; justify-content: center; padding:20px">
          <div style="width: 60px; height: 60px; ">
          <img src="${
            data.logo
          }" style="width: 100%; height: 100%;  border-radius: 30px;"/>
          </div>
          <div style="display: flex;">
         
          <h4 style="margin-left: 10px;text-transform: uppercase; margin-bottom:0px;"> 
          ${data.from_company_name}
         </h4>
          </div>
         
          ${heddings(data?.about_from_company_tag)}
          </div>
      
  
  </div>
  
  <div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
        <div style=" background-color: ${sidbarColor}; height: 100%; float: left;"></div> 
            <div
              style="
                height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                padding-left: 20px;padding-right: 10px;
              "
            >
            <br/>
            <br/>
            <br/>
            ${heddings("About the Company")}
          
  
              <div style="">
                  <div style=" text-align: left;">
                  ${paragraphs(data.about__from_company)}
                 
                    </div>
                  </div>
               </div>
            </div>
          </div>
  
  
        

      <div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
      <div style=" background-color:  ${sidbarColor}; height: 100%; float: left;"></div> 
<div
  style="
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-left: 20px;padding-right: 10px;
  "
>
<br/>
<br/>
<br/>
${heddings("OUR SERVICES")}

  <div style=" ">
  <ul>
  ${services?.map((item: string) => listItem(item))?.join("")}
</ul>
   </div>
   <div style="display: flex; justify-content: center ; ">
   
     
    </div>
</div>
</div>

<div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
      <div style="background-color:  ${sidbarColor}; height: 100%; float: left;"></div> 
<div
  style="
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-left: 20px;padding-right: 10px;
  "
>
<br/>
<br/>
<br/>
${heddings("TECHNOLOGY WE USE")}

  <div style=" ">
  <ul>
  ${technogies?.map((item: string) => listItem(item))?.join("")}
</ul>
   </div>
   <div style="display: flex; justify-content: center ; ">
   
     
    </div>
</div>
</div>




<div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
<div style="background-color: ${sidbarColor}; height: 100%; float: left;"></div> 
<div
style="
height: 100%;
overflow: hidden;
display: flex;
flex-direction: column;
padding-left: 20px;padding-right: 10px;
"
>
<br/>
<br/>
<br/>
${heddings("Terms & Conditions")}

<div style="">
${paragraphs(data.proposal_terms)}  
</div>

</div>
</div>



<div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
<div style="background-color:  ${sidbarColor}; height: 100%; float: left;"></div> 
<div
style="
height: 100%;
overflow: hidden;
display: flex;
flex-direction: column;
padding-left: 20px;padding-right: 10px;
"
>
<br/>
<br/>
<br/>
${heddings("Contact Us")}

<div style="">
<div style="display: flex;">
${paragraphscenter("<strong>Website : </strong>")}${paragraphs(data.from_website)}

</div>
<div style="display: flex;">
${paragraphscenter("  <strong>Phone : </strong>")}${paragraphs(data.from_mobile)}

</div>
<div style="display: flex;">
             
${paragraphscenter("<strong>Address : </strong>")}${paragraphs(data.from_address)}
</div>
<div style="display: flex;">
${paragraphscenter(" <strong>Email : </strong> ")}${paragraphs(data.from_email)}

</div>
</div>

</div>
</div>




<div style="text-align: center; height: 100vh; background-image: url('${pageBackground}');">
          
          <div style="height: 100%; overflow: hidden;  display: flex; flex-direction: column; align-items: center; justify-content: center; padding:20px">
          <div style="display: flex;">
          
        
         
          </div>
          ${heddings(data.proposal_title)}
          ${hedding2(data?.proposal_subtitle)}
          ${hedding2(moment(data.proposal_date).format("DD-MMMM-YYYY"))}
         
             
          </div>
      
  
  </div>





  
        <div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
              <div style=" background-color:  ${sidbarColor}; height: 100%; float: left;"></div> 
        <div
          style="
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding-left: 20px;padding-right: 10px;
          "
        >
        <br/>
        <br/>
        <br/>
        ${heddings("Proposal Details")}
  
          <div style=" ">
              ${paragraphs(data.proposal_details)}
           </div>
           <div style="display: flex; justify-content: center ; ">
           <table style=" width:100%; border-collapse: collapse; "cellpadding="10" >
           <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
             <tr>
               <th style="border: 1px solid black ;background-color: ${sidbarColor};">DESCRIPTION</th>
               <th style="border: 1px solid black ;background-color: ${sidbarColor};">QUANTITY</th>
               <th style="border: 1px solid black ;background-color: ${sidbarColor};">PRICE</th>
               <th style="border: 1px solid black ;background-color: ${sidbarColor};">TOTAL</th>
              
             </tr>
           </thead>
           ${data?.billing
             ?.map(
               (item: any, index: any) =>
                 `<tr key=${index}>
               <td style="border: 1px solid black ;">${item?.description}</td>
               <td style="border: 1px solid black ;">${item?.qty}</td>
               <td style="border: 1px solid black ;">${item?.price}</td>
               <td style="border: 1px solid black ;">${item?.total}</td>
             </tr>`
             )
             ?.join("")}
         </tbody>
         </table>
             
            </div>
        </div>
      </div>


      <div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
              <div style="background-color:  ${sidbarColor}; height: 100%; float: left;"></div> 
        <div
          style="
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding-left: 20px;padding-right: 10px;
          "
        >
        <br/>
        <br/>
        <br/>
        ${heddings("PROJECT PLAN")}
            <br/><br/>
          <div style=" ">
          <table style=" width:100%; border-collapse: collapse; "cellpadding="10" >
          <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
            <tr>
              <th style="border: 1px solid black ;background-color: ${sidbarColor};">Sl No</th>
              <th style="border: 1px solid black ;background-color: ${sidbarColor};">Module</th>
              <th style="border: 1px solid black ;background-color: ${sidbarColor};">Screens</th>
              <th style="border: 1px solid black ;background-color: ${sidbarColor};">Features</th>
              <th style="border: 1px solid black ;background-color: ${sidbarColor};">Details</th>
             
            </tr>
          </thead>
          ${data?.project_plan?.map(
            (item: any, index: any) =>
              `<tr key=${index}>
              <td style="border: 1px solid black ;">${index + 1}</td>
              <td style="border: 1px solid black ;">${item?.module}</td>
              <td style="border: 1px solid black ;">${item?.screens}</td>
              <td style="border: 1px solid black ;">${item?.features}</td>
              <td style="border: 1px solid black ;">${item?.details}</td>
            </tr>`
          )?.join('')}
        </tbody>
        </table>
           </div>
           <div style="display: flex; justify-content: center ; ">
          
            </div>
        </div>
      </div>

  
  <div style="text-align: center; height: 100vh; background-image: url('${pageBackground2}');">
        <div style="background-color: ${sidbarColor}; height: 100%; float: left;"></div> 
  <div
    style="
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding-left: 20px;padding-right: 10px;
    "
  >
  <br/>
  <br/>
  <br/>
  ${heddings("Conclusion")}
  
    <div ">
    ${paragraphs(data.conclusion)} 
     
     </div>
  
  </div>
  </div>
  
    </body>
  </html>
  

    `;
}
;