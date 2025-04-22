// public/js/utils/paginate.js
export function paginate(array, currentPage = 1, perPage = 1) {
    console.log(array);
    
    const offset = (currentPage - 1) * perPage;
    const paginatedItems = array.slice(offset, offset + perPage);
    const totalPages = Math.ceil(array.length / perPage);

    return {
        currentPage,
        perPage,
        totalItems: array.length,
        totalPages,
        data: paginatedItems,
    };
}

export function renderPaginationControls(container, currentPage, totalPages, onPageChange) {
    console.log(totalPages);
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
        btn.addEventListener("click", () => onPageChange(i));
        container.appendChild(btn);
    }
}
