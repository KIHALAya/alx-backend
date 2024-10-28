#!/usr/bin/env python3
"""
This module provides a helper function for pagination index calculation.
"""


def index_range(page: int, page_size: int) -> tuple:
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
