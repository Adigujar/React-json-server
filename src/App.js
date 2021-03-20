import React from 'react';


const Query = () => {
  const [Query, updateQuery] = React.useState([]);
  const [show, setShow] = React.useState(0);
  const [QueryName, setQueryName] = React.useState('');
  const [status]= React.useState('Active')
  const [description, setDesc] = React.useState('');

  function getQuery() {
    fetch(` https://reactjson-server.herokuapp.com/Query/`)
      .then((res) => res.json())
      .then((data) => {
        updateQuery(data);
      });
  }

  React.useEffect(() => {
    getQuery();
  }, []);

  const submitQuery = () => {
    let obj = { QueryName, description, id: Query[Query.length - 1]['id'] + 1, status };
    
    fetch(`https://reactjson-server.herokuapp.com/Query/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then((data) => {
        setQueryName('');
        setDesc('');
        getQuery();
      });
  };
  const editQuery = (obj, id) => {
    setShow(0);
    fetch(`https://reactjson-server.herokuapp.com/Query//${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then((data) => { 
        updateQuery(Query.map((ele) => (ele.id === id ? { ...ele } : ele)));
      });
  };

  const deleteQuery = (id) => {
    fetch(`https://reactjson-server.herokuapp.com/Query//${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        updateQuery(Query.filter((ele) => ele.id !== id));
      });
  };

  return (
    <div className="container">
      <div>
        <h1 className="text-center bg-primary text-white">QueryForm</h1>
      </div>
      <div className="row">
        <div className="col-lg-5 col-xl-5 col-sm-6 col-md-6 col-xs-12">
          <input type="text" className="form-control" placeholder="Enter a QueryName" value={QueryName} onChange={(event) => setQueryName(event.target.value)} />
        </div>
        <div className="col-lg-5 col-xl-5 col-sm-6 col-md-6 col-xs-12">
          <input type="text" className="form-control" placeholder="Enter a description" value={description} onChange={(event) => setDesc(event.target.value)} />
        </div>
        <br />
        <br />
      </div>
      <div className="col-lg-2 col-xl-2 col-sm-6 col-md-6 col-xs-12 ">
        <button type="button" className="ml-auto btn btn-primary" onClick={submitQuery}>New Query</button>
      </div>
      <div><h1 className='text-center'>Query List</h1></div>
      <table className="table table-responsive ">
        <thead>
          <tr className="bg-light  text-black">
            <th >Query ID</th>
            <th >QueryName</th>
            <th >Description</th>
            <th >Status</th>
            <th >Actions</th>
          </tr>
        </thead>
        <tbody>
          {Query.map((ele, index) => {
            return (
              <tr key={index}>
                <td>{ele.id}</td>
                <td>
                  {ele.QueryName}
                </td>
                <td>
                  {ele.description}
                </td>
                <td>
                {show === ele.id ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Status"
                      value={ele.status}
                      onChange={(event) => updateQuery(Query.map((data, dataIndex) => (dataIndex === index ? { ...data, status: event.target.value } : data)))}
                    />
                  ) : (
                    ele.status
                  )}

                </td>
                <td>
                  <span>
                    {show !== ele.id ? <button type="submit" className="btn-warning" onClick={() => setShow(ele.id)}>Update Status</button> : <button type="submit" onClick={() => editQuery(ele, ele.id)}> Update</button>}&nbsp;&nbsp;
                    <button className="btn-danger "onClick={() => deleteQuery(ele.id)}> Delete Query</button>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Query;
