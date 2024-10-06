const PhoneLink = () => {
  return (
    <a href={"sms:3478226610"} style={{ textDecoration: 'none', color: 'inherit' }} className='column'>
        <div className='row text--plus p-l-4 between'>
            <span>text to order:</span>
            <span>347.822.6610</span>
        </div>
        <hr/>
    </a>   
  );
}

export default PhoneLink;
