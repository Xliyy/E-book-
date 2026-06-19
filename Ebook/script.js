const uploadBtn =
document.getElementById("uploadBtn");

const fileInput =
document.getElementById("fileInput");

const status =
document.getElementById("status");

const library =
document.getElementById("library");

uploadBtn.addEventListener(
"click",

async () => {

const file =
fileInput.files[0];

if (!file) {

status.innerHTML =
"Choose a file";

return;
}

const formData =
new FormData();

formData.append(
"ebook",
file
);

status.innerHTML =
"Uploading...";

try {

const response =
await fetch(
"/upload",

{
method:"POST",

body:formData
});

const book =
await response.json();

status.innerHTML =
"Upload successful";

loadBooks();

} catch {

status.innerHTML =
"Upload failed";
}

});

async function loadBooks(){

const response =
await fetch("/books");

const books =
await response.json();

library.innerHTML="";

books.forEach(book=>{

library.innerHTML +=`

<div class="book">

<h3>${book.name}</h3>

<p>
${book.size} MB
</p>

<a
target="_blank"

href="/uploads/${book.file}">

Open

</a>

</div>

`;

});

}

loadBooks();