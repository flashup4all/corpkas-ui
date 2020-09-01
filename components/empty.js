import React from "react"

const EmptyData = (props) => {
  return(
    <div>
      <div className="row align-items-center justify-content-center">
        <img src="/images/empty.svg" alt=""></img>
      </div>
      <div className="center">
      { props.title.length>0 && <h6 className="mt-3">{ props.title }</h6> }
      { props.text.length>0 && <p>{ props.text }</p>}
    </div>
  </div>
  );
}
export default EmptyData;