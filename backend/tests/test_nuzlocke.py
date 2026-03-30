"""Backend tests for Nuzlocke Scanner API"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealth:
    def test_api_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200

class TestNuzlockeRuns:
    run_id = None

    def test_get_runs(self):
        r = requests.get(f"{BASE_URL}/api/nuzlocke/runs")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_run(self):
        r = requests.post(f"{BASE_URL}/api/nuzlocke/runs", json={
            "name": "TEST_Run Alpha",
            "game": "Pokemon Emerald",
            "core": "gba"
        })
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Run Alpha"
        assert data["game"] == "Pokemon Emerald"
        assert data["core"] == "gba"
        assert data["status"] == "active"
        assert "id" in data
        TestNuzlockeRuns.run_id = data["id"]

    def test_get_run_by_id(self):
        assert TestNuzlockeRuns.run_id, "Run not created"
        r = requests.get(f"{BASE_URL}/api/nuzlocke/runs/{TestNuzlockeRuns.run_id}")
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == TestNuzlockeRuns.run_id

    def test_update_run_status(self):
        assert TestNuzlockeRuns.run_id
        r = requests.put(f"{BASE_URL}/api/nuzlocke/runs/{TestNuzlockeRuns.run_id}", json={"status": "completed"})
        assert r.status_code == 200
        assert r.json()["status"] == "completed"

    def test_get_runs_has_encounter_counts(self):
        r = requests.get(f"{BASE_URL}/api/nuzlocke/runs")
        assert r.status_code == 200
        runs = r.json()
        if runs:
            assert "total_encounters" in runs[0]
            assert "alive_count" in runs[0]
            assert "dead_count" in runs[0]

class TestEncounters:
    encounter_id = None

    def test_get_encounters_empty(self):
        assert TestNuzlockeRuns.run_id
        r = requests.get(f"{BASE_URL}/api/nuzlocke/runs/{TestNuzlockeRuns.run_id}/encounters")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_add_encounter(self):
        assert TestNuzlockeRuns.run_id
        r = requests.post(f"{BASE_URL}/api/nuzlocke/runs/{TestNuzlockeRuns.run_id}/encounters", json={
            "location": "Route 101",
            "pokemon": "Treecko",
            "level": 5,
            "status": "alive",
            "hp_percent": 100
        })
        assert r.status_code == 200
        data = r.json()
        assert data["pokemon"] == "Treecko"
        assert data["location"] == "Route 101"
        assert data["run_id"] == TestNuzlockeRuns.run_id
        TestEncounters.encounter_id = data["id"]

    def test_update_encounter_faint(self):
        assert TestEncounters.encounter_id
        r = requests.put(f"{BASE_URL}/api/nuzlocke/encounters/{TestEncounters.encounter_id}", json={"status": "dead", "hp_percent": 0})
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "dead"

    def test_delete_encounter(self):
        assert TestEncounters.encounter_id
        r = requests.delete(f"{BASE_URL}/api/nuzlocke/encounters/{TestEncounters.encounter_id}")
        assert r.status_code == 200

    def test_delete_run_cleanup(self):
        assert TestNuzlockeRuns.run_id
        r = requests.delete(f"{BASE_URL}/api/nuzlocke/runs/{TestNuzlockeRuns.run_id}")
        assert r.status_code == 200

    def test_run_404_after_delete(self):
        assert TestNuzlockeRuns.run_id
        r = requests.get(f"{BASE_URL}/api/nuzlocke/runs/{TestNuzlockeRuns.run_id}")
        assert r.status_code == 404
