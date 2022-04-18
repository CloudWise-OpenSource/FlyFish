import React from 'react';

function ListDetail({match}) {

  const { id } = match.params;

  return (
    <div>
      选中用户为：{id}
    </div>
  );
}

export default ListDetail;
