$('#source').on('change', function(){
    const newDirectory = $(this).val();
    console.log('tgus', newDirectory);
    $.ajax({
        url: '/change-source',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ directory: newDirectory }),
        success: function (response) {
            console.log(response);
          if (response.success) {
            $('#playlist').html('');
            response.playlist.forEach(filePath => {
                const fileName = getFileName(filePath);
                const item = `
                  <li class="list-group-item" data-file="${filePath}">
                    <i class="fa fa-film"></i>
                    <a href="#">${fileName}</a>
                  </li>
                `;
                $('#playlist').append(item);
            });
            alert('Папка успешно изменена!');
          } else {
            alert('Ошибка при изменении папки.');
          }
        },
        error: function () {
          alert('Произошла ошибка при подключении к серверу.');
        }
      });
});

$('#source').trigger('change');

$('#playlist').on('click', 'li.list-group-item', function() {

});

function getFileName(filePath) {
    // const fileName = filePath.split('\\').pop();
    const fileName = filePath;
    return fileName.replace(/\.[^/.]+$/, '');
}