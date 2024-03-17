$(document).ready(function () {
  console.log("jauwrey");
  let selectedStatus = "";
  $(document).on("click", "#showCreateProjectModal", function (e) {
    console.log("show modal");
    $("#addProjectModal").css("display", "block");
  });

  $("#addProjectForm").submit(function (event) {
    console.log(event);
    event.preventDefault();

    $("#loader").removeClass("hidden");
    let formData = new FormData(this);

    console.log(formData, "formdata");
    $.ajax({
      url: "http://localhost:8000/api/projects",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log("Project added successfully!", response);
        $("#addProjectModal").hide();
        $("#loader").addClass("hidden");
        if (response.success) {
          alert(response.message);
        } else {
          alert("Error: " + response.message);
        }
        alert("Project added successfully");
      },
      error: function (xhr, status, error) {
        console.error("Error:", error, "j");
        $("#loader").addClass("hidden");
      },
    });
  });

  function formatDueDate(dueDate, checkMonth = false) {
    const dueDateObj = new Date(dueDate);
    const currentDate = new Date();

    console.log(checkMonth);

    if (checkMonth) {
      const options = { month: "long", day: "numeric", year: "numeric" };
      return dueDateObj.toLocaleDateString("en-US", options);
    } else {
      if (dueDateObj < currentDate) {
        return "0";
      }
      const timeDifference = dueDateObj - currentDate;
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);

      if (days < 30) {
        return `${days}d`;
      } else {
        return `${months}m`;
      }
    }
  }

  function getProject() {
    $.ajax({
      url: "http://localhost:8000/api/projects",
      type: "GET",
      success: function (response) {
        $(".table-card-body").empty();
        $.map(response, (obj, index) => {
          const { due_date, created_at, progress, name } = obj;
          const formatDate = formatDueDate(due_date);
          const formatCreatedDate = formatDueDate(new Date(created_at), true);
          console.log(obj, index, formatDate, formatCreatedDate);
          let projectsContent = `
              <div
              class="flex justify-around items-center border-[2px] rounded-lg p-4 mb-2"
            >
              <div class="flex items-center gap-4">
              <img class="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1572177812156-58036aae439c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D" />
              <div>
                <h2>${name}</h2>
                <span>${formatCreatedDate}</span>
              </div>
            </div>
            <div class="flex gap-[115px]">
              <div
                class="bg-[#f5f8fe] shadow-md flex justify-center items-center rounded-lg w-[100px]"
              >
                <span>${formatDate}</span>
              </div>
              <div class="flex flex-col">
                <span>90/148</span>
                <span>Tasks</span>
              </div>
              <div class="flex flex-col items-center">
                <span id="progressValue" class="text-blue-500 mt-2"
                  >${progress}% progress</span
                >
                <div
                  class="relative w-full h-2 rounded-full overflow-hidden bg-gray-300"
                >
                  <div
                    id="progressBar"
                    class="absolute top-0 left-0 h-full bg-blue-500"
                    style="width: ${progress}%; transition: width 0.3s ease"
                  ></div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex">
                <img
                class="rounded-full w-16 h-16"
                src="https://images.unsplash.com/photo-1610805796066-66f6052e1db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2VsZXNzfGVufDB8fDB8fHww"
                alt=""
              />
              <img
              class="rounded-full w-16 h-16"
              src="https://images.unsplash.com/photo-1610805796066-66f6052e1db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2VsZXNzfGVufDB8fDB8fHww"
              alt=""
            />
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex">
                      <button class="ellipsis-btn"><i class="fa fa-ellipsis-v"></i></button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            `;
          $(".table-card-body").append(projectsContent);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  }

  getProject();

  $(document).on("click", ".ellipsis-btn", function () {
    $("#editDeleteModal").show();
  });

  $(".closeModalBtn").click(function () {
    $("#addProjectModal").css("display", "none");
    $("#editDeleteModal").css("display", "none");
  });

  $("#searchBtn").click(function (event) {
    event.preventDefault();
    let searchQuery = $("#searchInput").val();
    let filters = {};

    console.log(searchQuery, "name");
    if (searchQuery) {
      filters["name"] = searchQuery;
    }
    if (selectedStatus) {
      filters["status"] = selectedStatus;
    }

    console.log("filters", filters);

    $.ajax({
      url: "http://localhost:8000/api/filter",
      type: "POST",
      data: { filters: JSON.stringify(filters) },
      success: function (response) {
        $(".table-card-body").empty();
        $("#searchLength").text(response.data.length + " results found");
        $.map(response?.data, (obj, index) => {
          const { due_date, created_at, progress, name } = obj;
          const formatDate = formatDueDate(due_date);
          const formatCreatedDate = formatDueDate(new Date(created_at), true);
          console.log(
            obj,
            index,
            formatDate,
            formatCreatedDate,
            "====SEARCh",
            response
          );
          let projectsContent = `
              <div
              class="flex justify-around items-center border-[2px] rounded-lg p-4 mb-2"
            >
              <div class="flex items-center gap-4">
              <img class="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1572177812156-58036aae439c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D" />
              <div>
                <h2>${name}</h2>
                <span>${formatCreatedDate}</span>
              </div>
            </div>
            <div class="flex gap-[115px]">
              <div
                class="bg-[#f5f8fe] shadow-md flex justify-center items-center rounded-lg w-[100px]"
              >
                <span>${formatDate}</span>
              </div>
              <div class="flex flex-col">
                <span>90/148</span>
                <span>Tasks</span>
              </div>
              <div class="flex flex-col items-center">
                <span id="progressValue" class="text-blue-500 mt-2"
                  >${progress}% progress</span
                >
                <div
                  class="relative w-full h-2 rounded-full overflow-hidden bg-gray-300"
                >
                  <div
                    id="progressBar"
                    class="absolute top-0 left-0 h-full bg-blue-500"
                    style="width: ${progress}%; transition: width 0.3s ease"
                  ></div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex">
                <img
                class="rounded-full w-16 h-16"
                src="https://images.unsplash.com/photo-1610805796066-66f6052e1db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2VsZXNzfGVufDB8fDB8fHww"
                alt=""
              />
              <img
              class="rounded-full w-16 h-16"
              src="https://images.unsplash.com/photo-1610805796066-66f6052e1db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2VsZXNzfGVufDB8fDB8fHww"
              alt=""
            />
           
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex">
                      <button class="ellipsis-btn"><i class="fa fa-ellipsis-v"></i></button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            `;
          $(".table-card-body").append(projectsContent);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  });

  $("#filterStatusBtn").click(function () {
    $("#filterStatusDropdown").toggleClass("hidden");
  });

  $("#filterStatus").change(function () {
    selectedStatus = $("#filterStatus").val();
  });
});
