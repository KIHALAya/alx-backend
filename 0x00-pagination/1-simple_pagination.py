#!/usr/bin/env python3
"""
Pagination module with Server class to paginate a dataset.
"""

import csv
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Returns a tuple of start and end index for pagination.

    Args:
        page (int): The 1-indexed page number.
        page_size (int): Number of items per page.

    Returns:
        tuple: (start index, end index) for the given page.
    """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index


class Server:
    """Server class to paginate a database of popular baby names."""

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset"""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Exclude header row

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Returns a page of data from the dataset.

        Args:
            page (int): The 1-indexed page number.
            page_size (int): Number of items per page.

        Returns:
            List[List]: A list of rows for the specified page.
        """
        # Validate arguments
        assert isinstance(page, int) and page > 0,
        "page must be a positive integer"
        assert isinstance(page_size, int) and page_size > 0,
        "page_size must be a positive integer"

        start_index, end_index = index_range(page, page_size)

        data = self.dataset()
        return data[start_index:end_index] if start_index < len(data) else []
