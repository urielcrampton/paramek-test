import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

def test_countries():
    response = client.get("/countries")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_countries_search():
    response = client.get("/countries?q=uruguay")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_trips():
    response = client.get("/trips")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_trip():
    trip_data = {
        "name": "Test Trip",
        "country": "Uruguay",
        "start_date": "2024-01-01",
        "end_date": "2024-01-07",
        "notes": "Test trip notes"
    }
    response = client.post("/trips", json=trip_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == trip_data["name"]
    assert data["country"] == trip_data["country"]
    assert "id" in data

def test_update_trip():
    # First create a trip
    trip_data = {
        "name": "Test Trip for Update",
        "country": "Argentina",
        "start_date": "2024-02-01",
        "end_date": "2024-02-07",
        "notes": "Test trip for update"
    }
    create_response = client.post("/trips", json=trip_data)
    trip_id = create_response.json()["id"]
    
    # Then update it
    update_data = {
        "name": "Updated Trip Name",
        "country": "Brazil",
        "start_date": "2024-03-01",
        "end_date": "2024-03-07",
        "notes": "Updated notes"
    }
    response = client.put(f"/trips/{trip_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["country"] == update_data["country"]

def test_delete_trip():
    # First create a trip
    trip_data = {
        "name": "Test Trip for Delete",
        "country": "Chile",
        "start_date": "2024-04-01",
        "end_date": "2024-04-07",
        "notes": "Test trip for delete"
    }
    create_response = client.post("/trips", json=trip_data)
    trip_id = create_response.json()["id"]
    
    # Then delete it
    response = client.delete(f"/trips/{trip_id}")
    assert response.status_code == 200
    assert response.json()["deleted"] == trip_id