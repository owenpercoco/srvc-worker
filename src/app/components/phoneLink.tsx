const PhoneLink = () => {
  return (
    <a href={"sms:3478226610"} style={{ textDecoration: 'none', color: 'inherit' }} className='flex flex-col'>
        <div className='flex flex-row justify-between text-[12px] font-semibold pb-2'>
            <span>text to order:</span>
            <span>347.822.6610</span>
        </div>
    </a>   
  );
}

export default PhoneLink;
